package com.github.nbsllc.inferno2d.projectiles

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.physics.box2d.Body
import com.badlogic.gdx.physics.box2d.BodyDef
import com.badlogic.gdx.physics.box2d.CircleShape
import com.badlogic.gdx.physics.box2d.World

class Laser(val position: Vector2, val direction: Vector2, world: World) {
    companion object {
        const val LENGTH = 15f
        const val LIFETIME = 1.5f
        const val SPEED = 450f
    }

    private val body: Body
    private var lifetime = LIFETIME
    private var disabled = false

    init {
        val tipPos = Vector2()
        tipPos.set(position).mulAdd(direction, 1f)

        val bodyDef = BodyDef()
        bodyDef.type = BodyDef.BodyType.KinematicBody
        bodyDef.position.set(tipPos)

        val shape = CircleShape()
        shape.radius = 4f

        body = world.createBody(bodyDef)
        body.createFixture(shape, 0f).isSensor = true
        shape.dispose()
    }

    fun isDisabled(): Boolean {
        return disabled
    }

    fun update(deltaTime: Float) {
        val startPosition = Vector2(position)
        val distanceToTravel = SPEED * deltaTime
        val endPosition = startPosition.mulAdd(direction, distanceToTravel)

        position.set(endPosition)
        body.linearVelocity = direction.cpy().nor().scl(SPEED)

        lifetime -= deltaTime
        if (lifetime <= 0) {
            disabled = true
        }
    }

    fun render(shapeRenderer: ShapeRenderer) {
        if (disabled) return

        shapeRenderer.begin(ShapeRenderer.ShapeType.Line)
        shapeRenderer.color = Color.WHITE
        val tailPos = Vector2()
        tailPos.set(position).mulAdd(direction, -LENGTH)
        shapeRenderer.line(tailPos.x, tailPos.y, position.x, position.y)
        shapeRenderer.end()
    }
}
