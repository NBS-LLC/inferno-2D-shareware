package com.github.nbsllc.inferno2d.actors

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Input
import com.badlogic.gdx.graphics.Color
import com.badlogic.gdx.graphics.glutils.ShapeRenderer
import com.badlogic.gdx.math.MathUtils
import com.badlogic.gdx.math.Polygon
import com.badlogic.gdx.math.Vector2
import com.badlogic.gdx.physics.box2d.Body
import com.badlogic.gdx.physics.box2d.BodyDef
import com.badlogic.gdx.physics.box2d.FixtureDef
import com.badlogic.gdx.physics.box2d.PolygonShape
import com.badlogic.gdx.physics.box2d.World

class Player(x: Float, y: Float, world: World) {
    companion object {
        const val PLAYER_SPEED = 150f
    }

    private var polygon: Polygon = Polygon(
        floatArrayOf(
            0f, 0f,
            30f, 10f,
            0f, 20f
        )
    )

    private var body: Body

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
    }

    fun getBody(): Body {
        return body
    }

    fun update() {
//        if (Gdx.input.isKeyJustPressed(Input.Keys.SPACE)) {
//            fireLaser()
//        }

        val targetVelocity = Vector2()
        if (Gdx.input.isKeyPressed(Input.Keys.LEFT)) targetVelocity.x = -1f
        if (Gdx.input.isKeyPressed(Input.Keys.RIGHT)) targetVelocity.x = 1f
        if (Gdx.input.isKeyPressed(Input.Keys.UP)) targetVelocity.y = 1f
        if (Gdx.input.isKeyPressed(Input.Keys.DOWN)) targetVelocity.y = -1f

        if (!targetVelocity.isZero) {
            targetVelocity.nor().scl(PLAYER_SPEED)
            body.linearVelocity = targetVelocity
        }
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
