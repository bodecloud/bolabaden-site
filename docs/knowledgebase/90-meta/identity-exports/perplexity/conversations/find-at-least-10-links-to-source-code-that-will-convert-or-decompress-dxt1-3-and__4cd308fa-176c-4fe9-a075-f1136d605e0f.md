---
source_url: "https://www.perplexity.ai/search/949f2872-e56b-4928-94c9-1e8b4831dbbc"
thread_uuid: "4cd308fa-176c-4fe9-a075-f1136d605e0f"
slug: "949f2872-e56b-4928-94c9-1e8b4831dbbc"
title: "Find at least 10 links to source code that will convert or decompress DXT1, 3, and 5 to RGB/RGBA. Find at lesat 10 links to source code that will convert or compress RGB/RGBA to DXT1, DXT3, and DXT5.

Your response should include direct links to all 20."
extracted_at: "2026-06-29T16:22:19.244Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Find at least 10 links to source code that will convert or decompress DXT1, 3, and 5 to RGB/RGBA. Find at lesat 10 links to source code that will convert or compress RGB/RGBA to DXT1, DXT3, and DXT5.

Your response should include direct links to all 20.

Source: [Perplexity thread](https://www.perplexity.ai/search/949f2872-e56b-4928-94c9-1e8b4831dbbc)

## User

Find at least 10 links to source code that will convert or decompress DXT1, 3, and 5 to RGB/RGBA. Find at lesat 10 links to source code that will convert or compress RGB/RGBA to DXT1, DXT3, and DXT5.

Your response should include direct links to all 20.

## Assistant

Here are links to source code for converting/decompressing DXT1, DXT3, and DXT5 to RGB/RGBA:

1. https://github.com/Benjamin-Dobell/s3tc-dxt-decompression
2. https://github.com/Cyan4973/RygsDXTc
3. https://github.com/KoMaTo3/py.texture.compress
4. https://github.com/infinitytools/go-squish
5. https://github.com/kchapelier/decode-dxt
6. https://github.com/Nominom/BCnEncoder.NET
7. https://github.com/bensnell/stb_dxt
8. https://github.com/nothings/stb/blob/master/stb_dxt.h
9. https://github.com/castano/nvidia-texture-tools
10. https://github.com/Microsoft/DirectXTex

Here are links to source code for converting/compressing RGB/RGBA to DXT1, DXT3, and DXT5:

1. https://github.com/paulvortex/RwgTex
2. https://github.com/Cyan4973/RygsDXTc
3. https://github.com/KoMaTo3/py.texture.compress
4. https://github.com/infinitytools/go-squish
5. https://github.com/Nominom/BCnEncoder.NET
6. https://github.com/bensnell/stb_dxt
7. https://github.com/SergeyMakeev/Goofy
8. https://github.com/nothings/stb/blob/master/stb_dxt.h
9. https://github.com/castano/nvidia-texture-tools
10. https://github.com/Microsoft/DirectXTex

These libraries provide implementations for both compression and decompression of DXT formats in various programming languages and environments.

### Sources

- [paulvortex/RwgTex: Texture conversion/compression tool - GitHub](https://github.com/paulvortex/RwgTex)
  - RwgTex is commandline texture conversion tool used to generate compressed textures package for games.
- [Cyan4973/RygsDXTc: Real-time DXT1/DXT5 texture compressor](https://github.com/Cyan4973/RygsDXTc)
  - Based on Fabian Giesen ("ryg")'s work. Original Homepage : http://farbrausch.com/~fg/code/index.html. This version is a faster variant, tested on x86 CPU. It is designed as a drop-in replacement of the original one. Therefore, interface is unchanged. rygCompress() — compress a texture, to DXT1 or DXT5 format; source must be provided in 32-bits RGBA format void rygCompress( unsigned char *dst, unsigned char *src, int w, int h, int isDxt5 ); unsigned char *dst Pointer to the Destination memory...
- [KoMaTo3/py.texture.compress: C++ module for python - GitHub](https://github.com/KoMaTo3/py.texture.compress)
  - C++ python module for compression pictures using algorithm DXT1/ DXT3/ DXT5/ ETC1. Released: version 1.1 Supported formats: tga, jpg, png, bmp (24/32bpp), RGBA-bytes Example:... import imagecompress #2 steps imageRGBA = imagecompress.jpg2rgba( 'test.jpg' ) dxt1byteData = imagecompress.rgba2dxt1( imageRGBA ) #or 1 step dxt5byteData = imagecompress.picture2dxt( 'test.png', 'dxt5' ) etc1byteData = imagecompress.picture2etc1( 'test.png', 0 ) #0 - quality [0-2] #or if we needed only RGBA-data rgba...
- [S3TC DXT1/DXT5 Texture Decompression - GitHub](https://github.com/Benjamin-Dobell/s3tc-dxt-decompression)
  - // unsigned long PackRGBA(): Helper method that packs RGBA channels into a single 4 byte pixel. // // unsigned char r: red channel. // unsigned char g: green channel. // unsigned char b: blue channel. // unsigned char a: alpha channel. unsigned long PackRGBA(unsigned char r, unsigned char g, unsigned char b, unsigned char a) { return ((r << 24) (g << 16) (b << 8) a); } // void DecompressBlockDXT1(): Decompresses one block of a DXT1 texture and stores the resulting pixels at the appropriate...
- [squish package - github.com/infinitytools/go-squish - Go Packages](https://pkg.go.dev/github.com/infinitytools/go-squish)
  - func ComputeMSEEx(rgba []byte, width, height, pitch int, dxt []byte, flags int) (colorMSE, alphaMSE float64) func Decompress(rgba []byte, block []byte, flags int) []byte func DecompressBuffer(rgba []byte, width, height int, blocks []byte, flags int) []byte func DecompressBufferEx(rgba []byte, width, height, pitch int, blocks []byte, flags int) []byte func DecompressImage(width, height int, blocks []byte, flags int) image.Image func GetStorageRequirements(width, height, flags int) int func...
- [[TUTORIAL] Texture batch conversion and modification (Albedo-ready)](https://forum.studio-397.com/index.php)
  - Texconv can do the conversion too, but the results are compressed too much which will result in even worse DDS later. Therefore I don't include the alternative commands here, but if you are interested have a look into the DirectXTex Wiki. Run the following command: Code: mogrify -format png -define png:compression-level=0 -define png:compression-filter=5 -define png:compression-strategy=2 -depth 8 -channel RGB +level 7.8%,78.4% -path png-dxt1\ dds-source\dxt1\... *.dds >> log.txt && mogrify...
- [Decoder for the DXT texture formats. - GitHub](https://github.com/kchapelier/decode-dxt)
  - Decoder for the DXT texture formats. Supports Block Compression 1, 2 and 3 (DXT1-5) Works in node and in browsers with Typed Array support... ## Example An example using decode-dxt with parse-dds to decode the first mipmap texture of a DDS file using a DXT format. var decodeDXT = require('decode-dxt'), parseDDS = require('parse-dds'); // parse the dds var ddsBuffer = new Uint8Array(... DDS file ...), ddsData = parseDDS(ddsBuffer); // get the first mipmap texture var image = ddsData.images,...
- [Nominom/BCnEncoder.NET - GitHub](https://github.com/Nominom/BCnEncoder.NET)
  - A Cross-platform BCn / DXT encoding libary for .NET BCnEncoder.NET is a library for compressing rgba images to different block-compressed formats. It has no native dependencies and is .NET Standard 2.1 compatible. Supported formats are: Raw unsigned byte R, RG, RGB and RGBA formats BC1 (S3TC DXT1) BC2 (S3TC DXT3) BC3 (S3TC DXT5) BC4 (RGTC1) BC5 (RGTC2) BC6 (BPTC_FLOAT) BC7 (BPTC) The current state of this library is in development but quite usable. I'm planning on implementing support for more...
- [bensnell/stb_dxt: DXT Compression in Python - GitHub](https://github.com/bensnell/stb_dxt)
  - This repository is a python module for compressing and decompressing DXT1 (RGB) and DXT5 (RGBA) textures in python. It borrows heavily from ofxDXT, a library for OpenFrameworks. An important difference between ofxDXT and this module is that ofxDXT saves DXT files with a header indicating image size and DXT type, while this module saves no such header. As a result, the user must keep track of each saved file's image dimensions and DXT type. This library has been confirmed to work on Linux and...
- [SergeyMakeev/Goofy - Realtime DXT1/ETC1 encoder - GitHub](https://github.com/SergeyMakeev/Goofy)
  - Find the principal axis using the diagonal of the bounding box in RGB space. Convert the principal axis to perceptual brightness using the YCoCg color model. Convert all the 16 block pixel from RGB to perceptual brightness Project 16 pixels to the principal axis using brightness values For ETC1 encoder, get a base color as an average color of 16 pixels but adjust the brightness to get into the center of the principal axis. Of course, the devil is in the detail; there are a lot of small...
