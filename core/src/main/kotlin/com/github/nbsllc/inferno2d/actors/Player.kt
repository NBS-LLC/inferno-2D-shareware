package com.github.nbsllc.inferno2d.actors

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Input
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Polygon
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.physics.box2d.*
import com.github.nbsllc.inferno2d.projectiles.Laser

class Player(x: Float, y: Float, world: World) {
    companion object {
        const val PLAYER_SPEED = 150f
        val SHIP_TIP_OFFSET_LOCAL = Vector2(15f, 0f)
        const val LASER_TAIL_OFFSET = 0.1f
    }

    private val polygon = Polygon(
        floatArrayOf(
            0f, 0f,
            30f, 10f,
            0f, 20f
        )
    )

    private val body: Body

    private val lasers: MutableList<Laser>

    init {
        polygon.setOrigin(15f, 10f)

        val bodyDef = BodyDef()
        bodyDef.type = BodyDef.BodyType.DynamicBody
        bodyDef.position.set(x, y)
        bodyDef.angularDamping = 1.0f
        bodyDef.linearDamping = 2.5f

        body = world.createBody(bodyDef)
        body.userData = polygon

        val shape = PolygonShape()
        val vertices = floatArrayOf(
            -15f, -10f,
            15f, 0f,
            -15f, 10f
        )
        shape.set(vertices)

        val fixtureDef = FixtureDef()
        fixtureDef.shape = shape
        fixtureDef.density = 1.0f
        fixtureDef.friction = 0.5f
        fixtureDef.restitution = 0.3f

        body.createFixture(fixtureDef)

        shape.dispose()

        lasers = mutableListOf()
    }

    fun getBody(): Body {
        return body
    }

    fun update(deltaTime: Float) {
        if (Gdx.input.isKeyJustPressed(Input.Keys.SPACE)) {
            fireLaser()
        }

        val targetVelocity = Vector2()
        if (Gdx.input.isKeyPressed(Input.Keys.LEFT)) targetVelocity.x = -1f
        if (Gdx.input.isKeyPressed(Input.Keys.RIGHT)) targetVelocity.x = 1f
        if (Gdx.input.isKeyPressed(Input.Keys.UP)) targetVelocity.y = 1f
        if (Gdx.input.isKeyPressed(Input.Keys.DOWN)) targetVelocity.y = -1f

        if (!targetVelocity.isZero) {
            targetVelocity.nor().scl(PLAYER_SPEED)
            body.linearVelocity = targetVelocity
        }

        val itLaser = lasers.iterator()
        while (itLaser.hasNext()) {
            val laser = itLaser.next()
            if (laser.isDisabled()) {
                itLaser.remove()
            } else {
                laser.update(deltaTime)
            }
        }
    }

    fun render(shapeRenderer: ShapeRenderer) {
        shapeRenderer.begin(ShapeRenderer.ShapeType.Line)
        shapeRenderer.color = Color.GRAY
        shapeRenderer.polygon(polygon.transformedVertices)
        shapeRenderer.end()

        for (laser in lasers) {
            laser.render(shapeRenderer)
        }
    }

    fun syncVisuals() {
        polygon.setPosition(body.position.x - polygon.originX, body.position.y - polygon.originY)
        polygon.rotation = body.angle * MathUtils.radiansToDegrees
    }

    private fun fireLaser() {
        val playerAngleRad = body.angle
        val playerPos = body.position

        val direction = Vector2(1f, 0f).rotateRad(playerAngleRad).nor()

        val tipOffsetWorld = SHIP_TIP_OFFSET_LOCAL.cpy().rotateRad(playerAngleRad)
        val shipTipPos = Vector2(playerPos).add(tipOffsetWorld)

        val startOffset = Laser.LENGTH + LASER_TAIL_OFFSET
        val startPos = shipTipPos.cpy().mulAdd(direction, startOffset)

        lasers.add(Laser(startPos, direction, body.world))
    }
}
