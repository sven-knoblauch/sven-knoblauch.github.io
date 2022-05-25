var particles = Particles.init({
	selector: '.background',
    color: ['#085563', '#d52940'],
    connectParticles: false,
    speed: 0,
    sizeVariations: 8,
    maxParticles: 220,
    responsive: [
        {
          breakpoint: 768,
          options: {
            maxParticles: 100
          }
        },
        {
            breakpoint: 425,
            options: {
              maxParticles: 30
            }
        }
    ]
});