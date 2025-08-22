# SCST - Simple Custom Subathon Timer
A simple StreamElements Subathon widget with extra functions that normal timers don't have.

## You can activate or deactivate being able to add time with:
- Chat messages (with cooldown)
- Follows
- Subs (normal, gifted, community gifts, all with bonus time if you want)
- Cheers (bits)
- Tips (US$)

## Install/Demo
Just enter this link and import it to your overlays: https://overlays.batary.dev/share/cmekyyqof0003l506whm9ehip

Demo: https://streamable.com/7bit14 (it's in spanish, and with salsa on the background, the perfect demonstration)

Do note that the import link has its code obfuscated, even though this repo has the non-obfuscated version.
Also, if you plan on modifying something, feel free to fork this and pull request or open an issue. But don't remove the "watermark", at most, just edit it to add your username if you feel like you contributed enough. Don't just delete it to claim it as your own, don't be a dick.

### Chat messages
Simple X seconds added per message per user, with X seconds of cooldown.

Default: 2 seconds added to the timer with 3 seconds of cooldown.
### Follows
X seconds per follow, simple as that.

Default: 10 seconds to the timer per follow
### Subs
This one has a lot of stuff.
Normal subs can give you X points, but you can set up bonus points for:
- Gifting a sub to someone else
- Gifting many subs (you can add them per-sub or every single second at once)
- Subbing with Tier 2 or 3
Every value is customizable and toggleable.
And yes, it stacks.

Default: 30s base / 10s bonus for gift / Every sub at once for community gifts / 20s Tier 2 / 30s Tier 3

### Cheers + Tips
Two sections: VPS (Value Per Second) and Custom Rules.
The latter is discussed on the next section.

VPS is managed by asking you the question "How much is a second?".
And so, the defaults are: 10 bits = 1s / US$0.1 = 1s

### Custom rules
These rules allow your viewers to either cheer or tip specific amounts, that allow you as the streamer to set a custom amount of seconds it adds, while bypassing the normal conditions for the categories.
They're managed using a JSON array.
#### Cheers (Bits)
```json
[{"bits":500, "seconds":4}]
```
#### Tips (US$)
These have a margin of 1 US$ at most so if someone gives you, let's say, US$ 10.1, it adds the 480 seconds instead of whatever you conversion is.
If you don't like it, feel free to just get rid of the addition on the code.
```json
[{"amount":10, "seconds":480}]
```

## WIP (Work in progress)
- Storing time to prevent reset each time we change a setting ✅
- ~~Hype trains multiplier (suggested by lexitoh on twitch)~~ This isn't possible, sadly. StreamElements doesn't have an event for this and Twitch doesn't make it any easier, since there's "autopilot", custom configs the streamer can do and other stuff that would make the counter try to guess when does it start and finish. Great idea, but we don't have the resources for this, sadly.
