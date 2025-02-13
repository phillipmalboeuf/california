import Plyr from 'plyr';

export function initPlyr() {
  const videoPlayers = document.querySelectorAll('[data-plyr-video]');
  if (videoPlayers.length > 0) {
    console.log('Initializing Plyr', videoPlayers);
    videoPlayers.forEach(player => {
      if (!(player as any).plyr) { // Only initialize if not already initialized
        new Plyr(player as HTMLElement, {
          controls: ['play-large', 'mute', 'fullscreen'],
          hideControls: true,
          autoplay: true,
          muted: true,
          loop: { active: true },
          storage: {
            enabled: false
          }
        });
      }
    });
  }
} 