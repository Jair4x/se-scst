# SCST - Simple Custom Subathon Timer
A simple StreamElements Subathon widget with extra functions that normal timers don't have.

## You can activate or deactivate being able to add time with:
- Chat messages (with cooldown)
- Follows
- Subs (normal, gifted, community gifts, all with bonus time if you want)
- Cheers (bits)
- Tips (US$)
- (NEW!) Hype Trains (Twitch event - time multiplier)

## Install/Demo
Just enter this link and import it to your overlays: https://overlays.batary.dev/share/cmf1dgznx0001jv06ga4ogxft (Updated September 1st, 2025)

Demo + Hype Train tutorial: https://streamable.com/7bit14 (no music, no anything, plain browser and full tutorial)

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
### Hype Trains
You can now link your Hype Train levels with:
- Time Multiplier
- Adding more multipliers to the multiplier per level (AKA for every level, increase the multiplier by X)

To make this work, you need to [log in here](https://id.twitch.tv/oauth2/authorize?client_id=520y5768mtvy8yaqxl9bm8yt4ulmrj&redirect_uri=https://twitch.cafecloudnine.com/redirect&response_type=token&scope=channel:read:hype_train) (don't worry, it's a real twitch site). 

Then, on the website you're gonna be redirected to, click `"Copy"` on the `token` field and press the button that says `"Save to Server"`. 

If you get an alert saying `"Token saved on server successfully!"` and to `"Go back to the widget to finish configuration"`, you're good. 

Paste the copied token to the `"Login (Hype train)"` section field and check the developer console. If it says `"Connected to backend via proxy."` and you see no weird error, you're done!

_**If you're facing errors or don't know how to work with this, contact me on Discord or open an issue and I'll help you out.**_
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
- Hype trains multiplier (suggested by lexitoh on twitch) ✅ (I thought this wasn't possible, but it is. I had to make an [external server](https://github.com/Jair4x/scst-server) with WebSockets to work with Twitch's events and make it work. Might need some testing and checking the code again to prevent any rare bugs.)
