package com.github.nbsllc.inferno2d.actors

import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Polygon
import com.badlogic.gdx.physics.box2d.*

class Anomaly(x: Float, y: Float, world: World) {
    companion object {
        const val ROTATION_SPEED = 90f
    }

    private val polygon = Polygon(
        floatArrayOf(
            0f, 0f,
            100f, 0f,
            100f, 100f,
            0f, 100f
        )
    )

    private val body: Body

    init {
        polygon.setOrigin(50f, 50f)

        val bodyDef = BodyDef()
        bodyDef.type = BodyDef.BodyType.KinematicBody
        bodyDef.position.set(x, y)

        body = world.createBody(bodyDef)
        body.userData = polygon

        val shape = PolygonShape()
        shape.setAsBox(50f, 50f)

        val fixtureDef = FixtureDef()
        fixtureDef.shape = shape
        fixtureDef.friction = 0.4f
        fixtureDef.restitution = 0.1f

        body.createFixture(fixtureDef)

        shape.dispose()
    }

    fun getBody(): Body {
        return body
    }

    fun update() {
        body.angularVelocity = ROTATION_SPEED * MathUtils.degreesToRadians
    }

    fun render(shapeRenderer: ShapeRenderer) {
        shapeRenderer.begin(ShapeRenderer.ShapeType.Line)
        shapeRenderer.color = Color.GRAY
        shapeRenderer.polygon(polygon.transformedVertices)
        shapeRenderer.end()
    }

    fun syncVisuals() {
        polygon.setPosition(body.position.x - polygon.originX, body.position.y - polygon.originY)
        polygon.rotation = body.angle * MathUtils.radiansToDegrees
    }
}
