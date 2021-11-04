# SoundCloud plugin for Volumio

Volumio plugin for playing SoundCloud tracks.

This repository has two branches:

1. The `master` branch is targeted towards Volumio 3.
2. The `volumio-2.x` branch is targeted towards Volumio 2.x.

The focus is on the `master` branch. The `volumio-2.x` branch will only be maintained if it is practically feasible and still worthwhile to do so.

### Getting Started

To install the plugin, first make sure you have [enabled SSH access](https://volumio.github.io/docs/User_Manual/SSH.html) on your Volumio device. Then, in a terminal:

```
$ ssh volumio@<your_Volumio_address>

volumio:~$ mkdir soundcloud-plugin
volumio:~$ cd soundcloud-plugin
volumio:~/soundcloud-plugin$ git clone https://github.com/patrickkfkan/volumio-soundcloud.git
volumio:~/soundcloud-plugin$ cd volumio-soundcloud
volumio:~/soundcloud-plugin$ git checkout volumio-2.x
volumio:~/soundcloud-plugin/volumio-soundcloud$ volumio plugin install

...
Progress: 100
Status :SoundCloud Successfully Installed, Do you want to enable the plugin now?
...

// If the process appears to hang at this point, just press Ctrl-C to return to the terminal.
```

Now access Volumio in a web browser. Go to ``Plugins -> Installed plugins`` and enable the SoundCloud plugin by activating the switch next to it.

### Updating

When a new version of the plugin becomes available, you can ssh into your Volumio device and update as follows (assuming you have not deleted the directory which you cloned from this repo):

```
volumio:~$ cd ~/soundcloud-plugin/volumio-soundcloud/
volumio:~/soundcloud-plugin/volumio-soundcloud$ git pull
...
volumio:~/soundcloud-plugin/volumio-soundcloud$ git checkout volumio-2.x
volumio:~/soundcloud-plugin/volumio-soundcloud$ volumio plugin update

This command will update the plugin on your device
...
Progress: 100
Status :Successfully updated plugin

// If the process appears to hang at this point, just press Ctrl-C to return to the terminal.

volumio:~/soundcloud-plugin/volumio-soundcloud$ sudo systemctl restart volumio
```
### Playback

The plugin uses [MPD](https://www.musicpd.org/) for playing a SoundCloud track, which can be in one or more of the following formats:

1. MPEG Audio (Progressive)
2. Ogg Opus (HLS)
3. MPEG Audio (HLS)

(These formats are revealed through inspecting the metadata of various SoundCloud tracks and may not be conclusive)

When playing a track, the plugin always looks for "MPEG Audio (Progressive)" first since this is the format compatible with the MPD version that came with Volumio 2.x.

If this format is not available, then the plugin will look for "Ogg Opus (HLS)". This format is not entirely compatible with the *really* outdated MPD version that came with Volumio 2.x. While the track will still play, you will likely encounter issues with seeking and the player status not updating. Until [Volumio 3.x](https://community.volumio.org/t/volumio-x86-debian-buster-debugging-party-beta/11899) is officially released (which is expected to include a recent version of MPD), here's a [temporary workaround](https://community.volumio.org/t/mpd-0-21-16-for-volumio-arm-armv7-and-x86/11554) (note: no guarantee that it will not break certain aspects of Volumio - use at own risk).

The last format, "MPEG Audio (HLS)", is the least desirable since it is not fully compatible even with a current version of MPD (tested with v0.22.2). The plugin will still play the stream, but playback will terminate if you try to seek.

>It appears that tracks that do not have "MPEG Audio (Progressive)" formats do have "Ogg Opus (HLS)". The chance of encountering an "MPEG Audio (HLS)" format should in fact be quite small.

### Limitations

**Regionally restricted tracks**. There are two kinds of these tracks:
- Those that cannot be played at all are marked as "Unavailable in your region" and will be skipped as they are encountered.
- Those where playback is limited to the first 30 seconds are marked as "Preview" and the plugin will play these tracks for the trimmed duration. You can choose to skip these tracks in the plugin settings.

**Account login** is not supported as this requires applying to SoundCloud for an API key, and:
- SoundCloud is not accepting applications at the moment;
- Even if applications were considered, it is uncertain whether an API key would be granted;
- Even if an API key were granted, requests would be subject to a daily quota limit. This limit would be shared by *all* users of the plugin and could be exceeded fairly easily with a large enough number of users.

### Supporting SoundCloud and Artists

If you come across an album that you like, consider purchasing it to support the SoundCloud platform and its artists. The plugin displays links where applicable so you can follow them to the corresponding SoundCloud pages.

### Changelog

0.1.0a-20210103
- [Change] Update soundcloud-fetch module (fixes track ordering)
- [Fix] Strip newline characters from MPD tags that could cause error

0.1.0a
- Initial release
