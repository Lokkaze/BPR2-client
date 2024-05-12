<template>
  <div>
    <video ref="videoElement" autoplay controls></video>
  </div>
</template>

<script>
import flvjs from 'flv.js';

export default {
  name: 'videoPlayer',
  props: {
    userId: {
      type: String
    }
  },
  data() {
    return {
      flvPlayer: null,
      flvUrl: `${process.env.VUE_APP_STREAM_API}/live/:userid.flv`,
      uuid: '',
    }
  },
  mounted() {
    this.playVideo()
  },
  created() {
    if(this.$route.params.uuid) {
      this.uuid = this.$route.params.uuid
      console.log('uuid: '+this.uuid)
    }
  },
  methods: {
    playVideo() {
      if(this.uuid) {
        const videoElement = this.$refs.videoElement
        videoElement.src = `${process.env.VUE_APP_STREAM_API}/terraform/v1/hooks/record/hls/${this.uuid}/index.mp4`
      }
      else {
      this.flvUrl = this.flvUrl.replace(':userid', this.userId)
      console.log(this.flvUrl)
      if (flvjs.isSupported()) {
      this.flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: this.flvUrl
      });
      this.flvPlayer.attachMediaElement(this.$refs.videoElement);
      this.flvPlayer.load();
      this.flvPlayer.play();
      }
    }
    }
  },
  beforeDestroy() {
    if (this.flvPlayer) {
      this.flvPlayer.destroy();
    }
  }
}
</script>
