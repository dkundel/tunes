export interface YouTubeTimeUpdate {
  currentTime: number;
  totalTime: number;
}

export interface YouTubeCallbacks {
  onTimeUpdate?: (evt: YouTubeTimeUpdate) => void;
  onVideoLoaded?: (evt: YT.VideoData) => void;
  onPlayPause?: (evt: YT.PlayerState) => void;
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

  public moveToPercentage(p: number) {
    let totalTime = this.player.getDuration();
    let targetTime = totalTime * p;
    this.player.seekTo(targetTime, true);
  }

  private onReady(evt: YT.EventArgs) {
    this.player.playVideo();
  }

  private onError(evt: YT.EventArgs) {
    if (evt.data === 100 || evt.data === 101 || evt.data === 150) {
      this.blockedVideos[evt.target.getPlaylistIndex()] = true;
      this.player.nextVideo();
    }
  }

  private onStateChange(evt: YT.EventArgs) {
    let interval;

    if (evt.data === YT.PlayerState.PLAYING) {
      if (this.callbacks.onTimeUpdate) {
        interval = setInterval(() => {
          let totalTime = this.player.getDuration();
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

    if (evt.data === YT.PlayerState.PAUSED || evt.data === YT.PlayerState.PLAYING) {
      if (this.callbacks.onPlayPause) {
        this.callbacks.onPlayPause(evt.data);
      }
    }
  }

  private player: YT.Player;
  private blockedVideos: {[index: number]: boolean} = {};
}