package com.github.nbsllc.inferno2d.projectiles

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.Vector2

class Laser(val position: Vector2, val direction: Vector2) {
    companion object {
        const val LENGTH = 15f
        const val LIFETIME = 1.5f
        const val SPEED = 450f
    }

    private var lifetime = LIFETIME
    private var disabled = false

    fun isDisabled(): Boolean {
        return disabled
    }

    fun update(deltaTime: Float) {
        val startPosition = Vector2(position)
        val distanceToTravel = SPEED * deltaTime
        val endPosition = startPosition.mulAdd(direction, distanceToTravel)

        // TODO: ray-cast?

        position.set(endPosition)
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
        tailPos.set(position).mulAdd(direction, LENGTH)
        shapeRenderer.line(tailPos.x, tailPos.y, position.x, position.y)
        shapeRenderer.end()
    }
}
