export default function Team() {
  return (
    <section className="team">
      <h2>Meet the Developers</h2>
      <p className="team__subtitle">
        The passionate minds behind UrbanSphere.
      </p>

      <div className="team__grid">

        <div className="team-card">
          <img src="https://i.pravatar.cc/150?img=5" alt="" />
          <h3>Loc Ng</h3>
          <p>AI Engineer / Backend Developer</p>
          <span>
            Specializes in machine learning models, routing algorithms, and system
            architecture.
          </span>
        </div>

        <div className="team-card">
          <img src="https://i.pravatar.cc/150?img=15" alt="" />
          <h3>Long K</h3>
          <p>Frontend Engineer</p>
          <span>
            Focused on delivering a flawless UX/UI and bringing the platform's
            visuals to life.
          </span>
        </div>

        <div className="team-card">
          <img src="https://i.pravatar.cc/150?img=25" alt="" />
          <h3>Anonymous</h3>
          <p>DevOps / Cloud Engineer</p>
          <span>
            Ensures reliability, scaling, and smooth deployment through cloud
            automation.
          </span>
        </div>

      </div>
    </section>
  );
}
