
export default class ParticleConfig {

    /**
     * Maximum time between frames before delta time is set to zero for no change in animation
     */
    static DT_THRESHOLD_MILLIS = 500;
    static NO_OF_PARTICLES_1920 = 6000;
    static NO_OF_PARTICLES_820 = 4000;
    static NO_OF_PARTICLES_430 = 2500;
    static MIN_PARTICLE_SIZE = 0.5;
    static MAX_PARTICLE_SIZE = 1;
    static PARTICLE_INIT_SPEED_Y_MIN = 0.005;
    static PARTICLE_INIT_SPEED_Y_MAX = 0.02;
    
    // interactive
    static IMPACT_RADIUS = 40;
    static BURST_SPEED_X = 0.2;
    static BURST_SPEED_Y = 0.2;
    static X_DECELARATION = 0.99;
    static Y_DECELARATION = 0.99;
    static X_TOLERANCE = 0.00001;
    static Y_TOLERANCE = 0.00001;
    static INTERPOLATION_FACTOR = 0.01;

    static RES_1920 = 1920;
    static RES_820 = 820;
    static RES_430 = 430;
}