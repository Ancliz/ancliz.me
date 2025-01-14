"use strict"

import { InvalidArgument } from "./exceptions.js";
import { finalise } from "./util.js";

function coordinateArgs(arg1, arg2) {
    return typeof arg1 === "number" && typeof arg2 === "number";
}

export class Point {

    /**
     * @param {Number | Point} arg1 the x coordinate or Point object 
     * @param {Number} arg2 the y coordinate (optional - ignored if arg1 is a Point)
     */
    constructor(arg1, arg2) {
        if(arg1 instanceof Point) {
            this.x = arg1.x;
            this.y = arg1.y;
        } else if(coordinateArgs(arg1, arg2)) {
            this.x = arg1;
            this.y = arg2;
        } else {
            throw new InvalidArgument("Expected numbers or Point.");
        }
    }

    toVec2d() {
        return new Vec2d(this);
    }

    toString() {
        return "(" + this.x + "," + this.y + ")"
    }

}

export class Vec2d {
    
    static Y_UNIT_VECTOR = new Vec2d(0,1);
    static X_UNIT_VECTOR = new Vec2d(1,0);

    static {
        finalise(Vec2d.Y_UNIT_VECTOR);
        finalise(Vec2d.X_UNIT_VECTOR);
    }

    /**
     * Create a new vector from a Point or Vec2d.
     * @param {Point | Vec2d} arg1 Point or Vec2d object, or x coordinate
     * @param {Number} arg2 the y coordinate (optional - ignored if arg1 is a Point or Vec2d)
     */
    constructor(arg1, arg2) {
        if(arg1 instanceof Point) {
            this.coords = arg1;
        } else if(arg1 instanceof Vec2d) {
            this.coords = new Point(arg1.coords);
        } else if(coordinateArgs(arg1, arg2)) {
            this.coords = new Point(arg1, arg2);
        } else {
            throw new InvalidArgument("Expected a Vector, Point or (x,y) coordinates.");
        }
        this.magnitude = Math.sqrt(this.coords.x*this.coords.x + this.coords.y*this.coords.y);
    }

    /**
     * @param {Vec2d} vector 
     * @param {Number} scalar 
     * @returns {Vec2d} a new Vec2d of the result of scalar multiplication.
     */
    static multiply(vector, scalar) {
        return new Vec2d(scalar * vector.coords.x, scalar * vector.coords.y);
    }

    /**
     * @param {Vec2d} v1
     * @param {Vec2d} v2
     * @returns {Vec2d} a new Vec2d of the displacement from v1 to v2.
     */
    static displacement(v1, v2) {
        return new Vec2d(v2.coords.x - v1.coords.x, v2.coords.y - v1.coords.y);
    }

    /**
     * @param {Vec2d} v1 
     * @param {Vec2d} v2 
     * @returns {Vec2d} a new Vec2d of the addition of two vectors.
     */
    static add(v1, v2) {
        return this.displacement(v1, v2.flip());
    }

    getUnitVec() {
        return Vec2d.multiply(this, 1 / this.magnitude);
    }

    dotProduct(other) {
        const x = this.coords.x * other.x;
        const y = this.coords.y * other.y;
        return x + y;
    }
    
    /**
     * @returns {Vec2d} a new Vec2d that is the inverse of the vector.
     */
    flip() {
        return new Vec2d(this.coords.x * -1, this.coords.y * -1);
    }

    toString() {
        return `[${this.coords}, ${this.magnitude}]`
    }
    
}