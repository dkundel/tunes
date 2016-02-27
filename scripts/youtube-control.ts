export interface YouTubeTimeUpdate {
  currentTime: number;
  totalTime: number;
}

export interface YouTubeCallbacks {
  onTimeUpdate: (evt: YouTubeTimeUpdate) => void;
  onVideoLoaded: (evt: YT.VideoData) => void;
}

export class YouTubePlayer {
  constructor(private containerId, private callbacks?: YouTubeCallbacks) {
  }

  public getPlayer(): YT.Player {
    return this.player;
  }

  public load(id: string, isPlaylist: boolean = false) {
    this.blockedVideos = {};

    let options: YT.PlayerOptions = {
      height: '300',
      width: '600',
      events: {
        onReady: evt => this.onReady(evt),
        onError: evt => this.onError(evt),
        onStateChange: evt => this.onStateChange(evt)
      }
    };

    if (isPlaylist) {
      options.playerVars = {
        list: id
      };
    } else {
      options.videoId = id;
    }

    this.player = new YT.Player(this.containerId, options);
  }

  public next() {
    let idx = this.player.getPlaylistIndex();
    do { idx++ } while(this.blockedVideos[idx]);

    this.player.playVideoAt(idx);
  }

  public prev() {
    let idx = this.player.getPlaylistIndex();
    do { idx-- } while(this.blockedVideos[idx]);

    this.player.playVideoAt(idx);
  }

  public playPause() {
    if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  private onReady(evt: YT.EventArgs) {
    console.log('READY');
    console.info(arguments);
    this.player.playVideo();
  }

  private onError(evt: YT.EventArgs) {
    if (evt.data === 100 || evt.data === 101 || evt.data === 150) {
      console.log('NEXT');
      console.dir(evt);
      this.blockedVideos[evt.target.getPlaylistIndex()] = true;
      this.player.nextVideo();
    }
  }

  private onStateChange(evt: YT.EventArgs) {
    let interval;

    if (evt.data === YT.PlayerState.PLAYING) {
      if (this.callbacks.onTimeUpdate) {
        let totalTime = this.player.getDuration();
        interval = setInterval(() => {
          let currentTime = this.player.getCurrentTime();
          this.callbacks.onTimeUpdate({currentTime, totalTime});
        }, 1000);
      }
    } else {
      clearInterval(interval);
    }

    if (evt.data === YT.PlayerState.BUFFERING) {
      let data = this.player.getVideoData();
      this.callbacks.onVideoLoaded(data);
    }
  }

  private player: YT.Player;
  private blockedVideos: {[index: number]: boolean} = {};
}