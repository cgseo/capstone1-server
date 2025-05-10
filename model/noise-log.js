class NoiseLog {
    constructor(id, noise_level, log_time, location, max_db, avg_db, user_id)
    {
        this.id = id;
        this.noise_level = noise_level;
        this.log_time = log_time;
        this.location = location;
        this.max_db = max_db;
        this.avg_db = avg_db;
        this.user_id = user_id;
    }
}