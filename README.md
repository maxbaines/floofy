# Floofy — Minecraft Java 26.1

Turn a wolf named **Floofy** into a little Bernese mountain dog inspired by your IKEA plush: dark fur, warm brown paws and eyebrows, a cream face stripe and belly, and a tiny tongue.

## Install

1. Use **Minecraft Java Edition 26.1** with [Fabric Loader](https://fabricmc.net/use/installer/).
2. Install a **26.1-compatible Fabric** version of [Entity Texture Features (ETF)](https://modrinth.com/mod/entitytexturefeatures/versions?g=26.1) in your Minecraft instance's `mods` folder. Choose the build for your exact game version and loader. ETF is required for the name rule.
3. Copy `Floofy-26.1.zip` into that instance's `resourcepacks` folder. Leave it zipped.
4. Start Minecraft and enable **Floofy** under **Options → Resource Packs**. Put Floofy above other wolf texture packs.
5. Rename a name tag **Floofy** in an anvil, then use it on your wolf. `floofy` and `FLOOFY` work too.

All nine wolf variants are covered, including wild, tame, angry and puppy textures. Other names and unnamed wolves keep their normal texture. Renaming Floofy to something else restores the normal look. A collar still uses its chosen dye color; wolf armor can cover the fur.

This is a client resource pack: each player who wants to see Floofy needs the pack and ETF. It changes the texture, retaining the normal wolf model, upright ears, sounds and behavior. It is not a Bedrock pack.

If the texture does not update immediately after naming, wait a few seconds or reload resources with **F3+T**. Check that ETF's custom/random entity textures option is enabled and that you launched the modded Minecraft instance.

## Build and preview

The ready-to-install ZIP is in `dist/`. To rebuild from the supplied artwork:

```sh
npm ci
npm run build
```

To inspect the adult and puppy models in a browser:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/preview/`. The preview uses the 26.1 cube geometry and texture coordinates. It is a model preview, not an in-game screenshot.

## Artwork and compatibility

Artwork generated with the built-in imagegen tool using the supplied plush photo. The final prompt is saved in `source/artwork-prompt.txt`, the original artwork in `source/floofy-adult-original.png`, and the fitted game textures in `source/floofy-adult.png` and `source/floofy-baby.png`. The build resizes and repacks the painted surfaces into the exact adult and puppy UV coordinates.

Resource format 84 and separate puppy textures were checked against [Mojang's Java 26.1 release notes](https://www.minecraft.net/en-us/article/minecraft-java-edition-26-1) and the official 26.1 client. Name matching and fallback use [ETF's documented random-entity rules](https://github.com/Traben-0/Entity_Texture_Features/blob/ETF-Main/.github/README-assets/random_entities.properties).

The build validates ZIP structure, texture dimensions, every wolf texture path against the official client (when locally cached), and the configured name and vanilla-fallback rules. The textures were inspected in the included 3D model preview. No Minecraft play session has been run here; in-game verification remains necessary.

Fan-made personal resource pack; not affiliated with IKEA, Mojang or Microsoft. No vanilla textures or Minecraft game files are included in the pack.
