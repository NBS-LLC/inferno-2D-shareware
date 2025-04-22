package com.github.nbsllc.inferno2d

import com.badlogic.gdx.ApplicationAdapter
import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Input
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.OrthographicCamera
import com.badlogic.gdx.graphics.g2d.BitmapFont
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.physics.box2d.Box2DDebugRenderer
import com.badlogic.gdx.physics.box2d.Fixture
import com.badlogic.gdx.physics.box2d.RayCastCallback
import com.badlogic.gdx.physics.box2d.World
import com.badlogic.gdx.utils.ScreenUtils
import com.badlogic.gdx.utils.viewport.ExtendViewport
import com.badlogic.gdx.utils.viewport.Viewport
import com.github.nbsllc.inferno2d.actors.Anomaly
import com.github.nbsllc.inferno2d.actors.Player
import kotlin.math.min

class Main : ApplicationAdapter() {
    companion object {
        const val DEBUG = true
        const val TIME_STEP = 1 / 120f
        const val VELOCITY_ITERATIONS = 6
        const val POSITION_ITERATIONS = 2
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

    private lateinit var anomaly: Anomaly
    private lateinit var player: Player

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

        anomaly = Anomaly(width / 2f, height / 2f, world)
        player = Player(width / 6f, height / 1.5f, world)
    }

    private fun update(deltaTime: Float) {
        player.update(deltaTime)
        anomaly.update()
        stepWorld(deltaTime)
        syncVisuals(deltaTime)
    }

    private val laserRayCastCallback = object : RayCastCallback {
        var didHit: Boolean = false
        var hitFixture: Fixture? = null

        fun reset() {
            didHit = false
            hitFixture = null
        }

        override fun reportRayFixture(fixture: Fixture, point: Vector2, normal: Vector2, fraction: Float): Float {
            if (fixture.body == anomaly.getBody()) {
                didHit = true
                hitFixture = fixture
                return 0f
            }
            return -1f
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
        player.syncVisuals()
        anomaly.syncVisuals()

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
        anomaly.render(shapeRenderer)
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
