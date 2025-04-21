package com.github.nbsllc.inferno2d

import com.badlogic.gdx.ApplicationAdapter
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Input
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Polygon
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.physics.box2d.*
import com.badlogic.gdx.utils.ScreenUtils
import com.badlogic.gdx.utils.viewport.ExtendViewport
import com.badlogic.gdx.utils.viewport.Viewport
import com.github.nbsllc.inferno2d.actors.Player
import kotlin.math.min

data class Laser(
    val position: Vector2,
    val direction: Vector2,
    var lifetime: Float,
    val speed: Float,
    val length: Float
)

class Main : ApplicationAdapter() {
    companion object {
        const val DEBUG = true
        const val TIME_STEP = 1 / 120f
        const val VELOCITY_ITERATIONS = 6
        const val POSITION_ITERATIONS = 2
        const val ANOMALY_ROTATION_SPEED_DEG_PER_SEC = 90f
        const val LASER_SPEED = 450f
        const val LASER_LIFETIME = 1.5f
        const val LASER_LENGTH = 15f
        const val LASER_TAIL_OFFSET = 0.1f
        val SHIP_TIP_OFFSET_LOCAL = Vector2(15f, 0f)

        const val AVERAGE_INTERVAL = 1.0f
    }

    private lateinit var camera: OrthographicCamera
    private lateinit var viewport: Viewport
    private lateinit var shapeRenderer: ShapeRenderer
    private lateinit var batch: SpriteBatch
    private lateinit var font: BitmapFont

    private lateinit var world: World
    private lateinit var debugRenderer: Box2DDebugRenderer
    private var accumulator = 0f

    private lateinit var player: Player
    private lateinit var anomalyPolygon: Polygon
    private lateinit var anomalyBody: Body

    private lateinit var lasers: MutableList<Laser>
    private val laserStartPos = Vector2()
    private val laserEndPos = Vector2()
    private val laserHitPoint = Vector2()

    private var lastPlayerPos = Vector2()
    private var distanceAccumulator = 0f
    private var timeAccumulator = 0f
    private var averageSpeed = 0f
    private var isFirstSync = true

    override fun create() {
        val width = 1000f
        val height = 1000f

        camera = OrthographicCamera()
        viewport = ExtendViewport(width, height, camera)

        shapeRenderer = ShapeRenderer()
        batch = SpriteBatch()
        font = BitmapFont()

        world = World(Vector2(0f, 0f), true)
        debugRenderer = Box2DDebugRenderer()

        lasers = mutableListOf()

        createAnomaly(width / 2f, height / 2f)
        player = Player(width / 6f, height / 1.5f, world)
    }

    @Suppress("SameParameterValue")
    private fun createAnomaly(x: Float, y: Float) {
        anomalyPolygon = Polygon(floatArrayOf(0f, 0f, 100f, 0f, 100f, 100f, 0f, 100f))
        anomalyPolygon.setOrigin(50f, 50f)

        val bodyDef = BodyDef()
        bodyDef.type = BodyDef.BodyType.KinematicBody
        bodyDef.position.set(x, y)

        anomalyBody = world.createBody(bodyDef)
        anomalyBody.userData = anomalyPolygon

        val shape = PolygonShape()
        shape.setAsBox(50f, 50f)

        val fixtureDef = FixtureDef()
        fixtureDef.shape = shape
        fixtureDef.friction = 0.4f
        fixtureDef.restitution = 0.1f

        anomalyBody.createFixture(fixtureDef)

        shape.dispose()
    }

    private fun update(deltaTime: Float) {
        player.update()
        updateAnomaly()
        updateLasers(deltaTime)
        stepWorld(deltaTime)
        syncVisuals(deltaTime)
    }

    private fun updateAnomaly() {
        val angularVelocityRad = ANOMALY_ROTATION_SPEED_DEG_PER_SEC * MathUtils.degreesToRadians
        anomalyBody.angularVelocity = angularVelocityRad
    }

    private val laserRayCastCallback = object : RayCastCallback {
        var didHit: Boolean = false
        var hitFixture: Fixture? = null

        fun reset() {
            didHit = false
            hitFixture = null
        }

        override fun reportRayFixture(fixture: Fixture, point: Vector2, normal: Vector2, fraction: Float): Float {
            if (fixture.body == anomalyBody) {
                didHit = true
                hitFixture = fixture
                laserHitPoint.set(point)
                return 0f
            }
            return -1f
        }
    }

    private fun updateLasers(deltaTime: Float) {
        val iterator = lasers.iterator()
        while (iterator.hasNext()) {
            val laser = iterator.next()

            laserStartPos.set(laser.position)
            val distanceToTravel = laser.speed * deltaTime
            laserEndPos.set(laserStartPos).mulAdd(laser.direction, distanceToTravel)

            laserRayCastCallback.reset()
            world.rayCast(laserRayCastCallback, laserStartPos, laserEndPos)

            if (laserRayCastCallback.didHit) {
                iterator.remove()
                continue
            } else {
                laser.position.set(laserEndPos)
                laser.lifetime -= deltaTime
                if (laser.lifetime <= 0) {
                    iterator.remove()
                }
            }
        }
    }

    private fun stepWorld(deltaTime: Float) {
        val clampedDeltaTime = min(deltaTime, 0.25f)
        accumulator += clampedDeltaTime
        while (accumulator >= TIME_STEP) {
            world.step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS)
            accumulator -= TIME_STEP
        }
    }

    private fun syncVisuals(deltaTime: Float) {
        val anomalyBodyPos = anomalyBody.position
        val anomalyBodyAngleDeg = anomalyBody.angle * MathUtils.radiansToDegrees
        anomalyPolygon.setPosition(anomalyBodyPos.x - anomalyPolygon.originX, anomalyBodyPos.y - anomalyPolygon.originY)
        anomalyPolygon.rotation = anomalyBodyAngleDeg

        val playerBodyPos = player.getBody().position

        if (deltaTime > 0) {
            if (isFirstSync) {
                lastPlayerPos.set(playerBodyPos)
                isFirstSync = false
            } else {
                val distanceMoved = playerBodyPos.dst(lastPlayerPos)
                distanceAccumulator += distanceMoved
                timeAccumulator += deltaTime
                lastPlayerPos.set(playerBodyPos)

                if (timeAccumulator >= AVERAGE_INTERVAL) {
                    averageSpeed = distanceAccumulator / timeAccumulator
                    distanceAccumulator = 0f
                    timeAccumulator = 0f
                }
            }
        }
    }

    private fun fireLaser() {
        val playerAngleRad = player.getBody().angle
        val playerPos = player.getBody().position

        val direction = Vector2(1f, 0f).rotateRad(playerAngleRad).nor()

        val tipOffsetWorld = SHIP_TIP_OFFSET_LOCAL.cpy().rotateRad(playerAngleRad)
        val shipTipPos = Vector2(playerPos).add(tipOffsetWorld)

        val startOffset = LASER_LENGTH + LASER_TAIL_OFFSET
        val startPos = shipTipPos.cpy().mulAdd(direction, startOffset)

        val newLaser = Laser(
            position = startPos,
            direction = direction,
            lifetime = LASER_LIFETIME,
            speed = LASER_SPEED,
            length = LASER_LENGTH
        )

        lasers.add(newLaser)
    }

    override fun render() {
        if (Gdx.input.isKeyPressed(Input.Keys.ESCAPE)) {
            Gdx.app.exit()
        }

        update(Gdx.graphics.deltaTime)
        camera.update()

        shapeRenderer.projectionMatrix = camera.combined
        batch.projectionMatrix = camera.combined

        ScreenUtils.clear(0f, 0f, 0f, 1f, true)

        renderBackground()
        player.render(shapeRenderer)
        renderGameObjects()
        renderLasers()
        renderDebug()
        renderUI()
    }

    private fun renderBackground() {
        val worldWidth = viewport.worldWidth
        val worldHeight = viewport.worldHeight
        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)
        for (y in 0 until worldHeight.toInt()) {
            val ratio = y / worldHeight
            val color = Color(0.1f * ratio, 0.3f * ratio, 0.5f * ratio, 1f)
            shapeRenderer.color = color
            shapeRenderer.rect(0f, y.toFloat(), worldWidth, 1f)
        }
        shapeRenderer.end()
    }

    private fun renderGameObjects() {
        shapeRenderer.begin(ShapeRenderer.ShapeType.Line)
        shapeRenderer.color = Color.GRAY
        shapeRenderer.polygon(anomalyPolygon.transformedVertices)
        shapeRenderer.end()
    }

    private fun renderLasers() {
        shapeRenderer.begin(ShapeRenderer.ShapeType.Line)
        shapeRenderer.color = Color.WHITE
        val tailPos = Vector2()
        for (laser in lasers) {
            tailPos.set(laser.position).mulAdd(laser.direction, -laser.length)
            shapeRenderer.line(tailPos.x, tailPos.y, laser.position.x, laser.position.y)
        }
        shapeRenderer.end()
    }

    private fun renderDebug() {
        if (DEBUG) {
            debugRenderer.render(world, camera.combined)
        }
    }

    private fun renderUI() {
        val worldHeight = viewport.worldHeight
        batch.begin()
        font.draw(batch, "FPS: ${Gdx.graphics.framesPerSecond}", 10f, worldHeight - 10f)
        font.draw(batch, "Resolution: ${Gdx.graphics.width}x${Gdx.graphics.height}", 10f, worldHeight - 30f)
        font.draw(batch, "Avg Speed: ${String.format("%.2f", averageSpeed)}", 10f, worldHeight - 50f)
        batch.end()
    }

    override fun resize(width: Int, height: Int) {
        viewport.update(width, height, true)
    }

    override fun dispose() {
        shapeRenderer.dispose()
        batch.dispose()
        font.dispose()
        world.dispose()
        debugRenderer.dispose()
    }
}
