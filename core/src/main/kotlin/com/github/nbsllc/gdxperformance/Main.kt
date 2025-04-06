package com.github.nbsllc.gdxperformance

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

class Main : ApplicationAdapter() {
    companion object {
        const val TIME_STEP = 1 / 60f
        const val VELOCITY_ITERATIONS = 6
        const val POSITION_ITERATIONS = 2
        const val ANOMALY_ROTATION_SPEED_DEG_PER_SEC = 90f
    }

    private lateinit var camera: OrthographicCamera
    private lateinit var viewport: Viewport
    private lateinit var shapeRenderer: ShapeRenderer
    private lateinit var batch: SpriteBatch
    private lateinit var font: BitmapFont

    private lateinit var world: World
    private lateinit var debugRenderer: Box2DDebugRenderer
    private var accumulator = 0f

    private lateinit var anomalyPolygon: Polygon
    private lateinit var playerPolygon: Polygon

    private lateinit var anomalyBody: Body
    private lateinit var playerBody: Body

    @Suppress("SameParameterValue")
    private fun createPlayer(x: Float, y: Float) {
        playerPolygon = Polygon(
            floatArrayOf(
                0f, 0f, 30f, 10f, 0f, 20f
            )
        )
        playerPolygon.setOrigin(15f, 10f)
        playerPolygon.setPosition(x - 15f, y - 10f)

        val bodyDef = BodyDef()
        bodyDef.type = BodyDef.BodyType.DynamicBody
        bodyDef.position.set(x, y)
        bodyDef.angularDamping = 1.0f
        bodyDef.linearDamping = 2.5f

        playerBody = world.createBody(bodyDef)
        playerBody.userData = playerPolygon


        val shape = PolygonShape()
        val vertices = floatArrayOf(
            -15f, -10f, 15f, 0f, -15f, 10f
        )
        shape.set(vertices)

        val fixtureDef = FixtureDef()
        fixtureDef.shape = shape
        fixtureDef.density = 1.0f
        fixtureDef.friction = 0.5f
        fixtureDef.restitution = 0.3f

        playerBody.createFixture(fixtureDef)

        shape.dispose()
    }

    @Suppress("SameParameterValue")
    private fun createAnomaly(x: Float, y: Float) {
        anomalyPolygon = Polygon(
            floatArrayOf(
                0f, 0f, 100f, 0f, 100f, 100f, 0f, 100f
            )
        )
        anomalyPolygon.setOrigin(50f, 50f)
        anomalyPolygon.setPosition(x - 50f, y - 50f)

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

    private fun updatePlayer() {
        val speed = 250f
        val targetVelocity = Vector2()

        if (Gdx.input.isKeyPressed(Input.Keys.LEFT)) targetVelocity.x = -1f
        if (Gdx.input.isKeyPressed(Input.Keys.RIGHT)) targetVelocity.x = 1f
        if (Gdx.input.isKeyPressed(Input.Keys.UP)) targetVelocity.y = 1f
        if (Gdx.input.isKeyPressed(Input.Keys.DOWN)) targetVelocity.y = -1f

        if (!targetVelocity.isZero) {
            targetVelocity.nor().scl(speed)
            playerBody.linearVelocity = targetVelocity
        }
    }

    private fun updateAnomaly() {
        val angularVelocityRad = ANOMALY_ROTATION_SPEED_DEG_PER_SEC * MathUtils.degreesToRadians
        anomalyBody.angularVelocity = angularVelocityRad
    }

    private fun stepWorld(deltaTime: Float) {
        accumulator += deltaTime
        while (accumulator >= TIME_STEP) {
            world.step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS)
            accumulator -= TIME_STEP
        }
    }

    private fun syncVisuals() {
        val playerBodyPos = playerBody.position
        val playerBodyAngleDeg = playerBody.angle * MathUtils.radiansToDegrees
        playerPolygon.setPosition(playerBodyPos.x - playerPolygon.originX, playerBodyPos.y - playerPolygon.originY)
        playerPolygon.rotation = playerBodyAngleDeg

        val anomalyBodyPos = anomalyBody.position
        val anomalyBodyAngleDeg = anomalyBody.angle * MathUtils.radiansToDegrees
        anomalyPolygon.setPosition(anomalyBodyPos.x - anomalyPolygon.originX, anomalyBodyPos.y - anomalyPolygon.originY)
        anomalyPolygon.rotation = anomalyBodyAngleDeg
    }

    override fun create() {
        val width = 1000f
        val height = 1000f

        camera = OrthographicCamera()
        camera.setToOrtho(false, width, height)
        camera.update()

        viewport = ExtendViewport(width, height, camera)

        shapeRenderer = ShapeRenderer()
        batch = SpriteBatch()
        font = BitmapFont()

        world = World(Vector2(0f, 0f), true)
        debugRenderer = Box2DDebugRenderer()

        createAnomaly(width / 2f, height / 2f)
        createPlayer(width / 6f, height / 1.5f)
    }

    override fun render() {
        val deltaTime = Gdx.graphics.deltaTime

        if (Gdx.input.isKeyPressed(Input.Keys.ESCAPE)) {
            Gdx.app.exit()
        }

        updatePlayer()
        updateAnomaly()

        stepWorld(deltaTime)

        syncVisuals()

        ScreenUtils.clear(0f, 0f, 0f, 1f, true)
        camera.update()
        viewport.apply()

        val worldWidth = viewport.worldWidth
        val worldHeight = viewport.worldHeight
        shapeRenderer.projectionMatrix = camera.combined
        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled)
        for (y in 0 until worldHeight.toInt()) {
            val ratio = y / worldHeight
            val color = Color(0.1f * ratio, 0.3f * ratio, 0.5f * ratio, 1f)
            shapeRenderer.color = color
            shapeRenderer.rect(0f, y.toFloat(), worldWidth, 1f)
        }
        shapeRenderer.end()

        shapeRenderer.begin(ShapeRenderer.ShapeType.Line)
        shapeRenderer.color = Color.GRAY
        shapeRenderer.polygon(anomalyPolygon.transformedVertices)
        shapeRenderer.color = Color.GRAY
        shapeRenderer.polygon(playerPolygon.transformedVertices)
        shapeRenderer.end()

        debugRenderer.render(world, camera.combined)

        batch.projectionMatrix = camera.combined
        batch.begin()
        font.draw(batch, "FPS: ${Gdx.graphics.framesPerSecond}", 10f, worldHeight - 10f)
        font.draw(batch, "Resolution: ${Gdx.graphics.width}x${Gdx.graphics.height}", 10f, worldHeight - 30f)
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
