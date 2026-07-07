---
source_url: "https://www.perplexity.ai/search/0c711497-ce60-46a3-ac02-0b7aa5a71c6d"
thread_uuid: "37bb90df-1d2f-42af-9d0e-3737155eb367"
slug: "0c711497-ce60-46a3-ac02-0b7aa5a71c6d"
title: "I am writing an image parser, specifically to/from DXT1/DXT5. Are there any existing trustworthy/reliable libraries that have implemented these functions that I can reference? It does not matter what language."
extracted_at: "2026-06-29T12:53:35.765Z"
matched_keywords: ["cluster"]
entry_count: 3
provenance: perplexity-rest-api
---

# I am writing an image parser, specifically to/from DXT1/DXT5. Are there any existing trustworthy/reliable libraries that have implemented these functions that I can reference? It does not matter what language.

Source: [Perplexity thread](https://www.perplexity.ai/search/0c711497-ce60-46a3-ac02-0b7aa5a71c6d)

## User

I am writing an image parser, specifically to/from DXT1/DXT5. Are there any existing trustworthy/reliable libraries that have implemented these functions that I can reference? It does not matter what language.

## Assistant

There are several reliable libraries and implementations available for parsing and encoding DXT1/DXT5 compressed textures. Here are some options you can reference:

## decode-dxt

This is a JavaScript library that provides a decoder for DXT texture formats, including DXT1 and DXT5. Key features include:[1]

- Supports Block Compression 1, 2 and 3 (DXT1-5)
- Works in Node.js and browsers with Typed Array support
- Simple API for decoding DXT data to RGBA

The library offers a straightforward method to decode DXT compressed textures:

```javascript
var rgbaData = decodeDXT(imageDataView, imageWidth, imageHeight, format);
```

## NVIDIA Texture Tools

NVIDIA provides a comprehensive set of texture processing tools that support DXT1 and DXT5 compression and decompression. These tools are widely used in the game development industry and offer high-quality results.[2]

## squish

Squish is a popular open-source DXT compression library written in C++. It's known for its ease of use and good compression quality.[2]

## RygsDXTc

This is a real-time DXT1/DXT5 compression library in C, based on Fabian Giesen's work. It's designed for fast compression and offers a simple API:[4]

```c
void rygCompress(unsigned char *dst, unsigned char *src, int w, int h, int isDxt5);
```

## crunch

Crunch is an advanced DXTc texture compression and transcoding library. While it focuses on its own .CRN format, it also supports standard DXT1 and DXT5 compression to .DDS files. It provides both a command-line tool and a C++ library.[5]

## DirectXTex

Microsoft's DirectXTex library, part of the DirectX Tool Kit, provides robust support for DXT texture formats. It's written in C++ and is well-maintained by Microsoft.

When choosing a library, consider factors such as:

- **Performance**: If speed is crucial, RygsDXTc or crunch might be good options.
- **Quality**: NVIDIA Texture Tools and DirectXTex are known for high-quality results.
- **Ease of use**: decode-dxt and squish have simpler APIs if you prefer that.
- **Language**: Choose a library that matches or can easily integrate with your project's language.

Remember to respect the licensing terms of whichever library you decide to reference or use in your project.

### Sources

- [Decoder for the DXT texture formats. - GitHub](https://github.com/kchapelier/decode-dxt)
  - Decoder for the DXT texture formats. Supports Block Compression 1, 2 and 3 (DXT1-5) Works in node and in browsers with Typed Array support... ## Example An example using decode-dxt with parse-dds to decode the first mipmap texture of a DDS file using a DXT format. var decodeDXT = require('decode-dxt'), parseDDS = require('parse-dds'); // parse the dds var ddsBuffer = new Uint8Array(... DDS file ...), ddsData = parseDDS(ddsBuffer); // get the first mipmap texture var image = ddsData.images,...
- [Compressed texture formats (DXT1 DXT3 DXT5 etc) - GameDev.net](https://www.gamedev.net/forums/topic/582176-compressed-texture-formats-dxt1-dxt3-dxt5-etc/)
  - Quote: Until now I've used DXT5 for all textures except normal maps (I do not use any compression on them), because those react horribly to DXT compression. Compressed normal maps look pretty good if you do it right. Use a DXT5 texture and put the x-component of the normal map into the alpha channel and zero out r and b. In the shader, you reconstruct the z-component by Note that this only works for tangent-space normal maps (unless you encode the sign of n.z somewhere). float3 n =...
- [DXT - Polycount Wiki](http://wiki.polycount.com/wiki/DXT)
  - DXT DXT is a texture compression format, formerly known as S3TC. DXT is widely supported on current graphics hardware, meaning it will stay compressed in video memory, allowing the artist to use more or larger textures. There are five DXT formats: DXT1, DXT2, DXT3, DXT4, and DXT5. In DirectX 10 it is known as Block Compression and comes in five basic flavors: BC1, BC2, BC3, BC4, and BC5. The DXT compression format can be stored inside many container files like DDS, VTF, etc. but DDS is the...
- [Cyan4973/RygsDXTc: Real-time DXT1/DXT5 texture compressor](https://github.com/Cyan4973/RygsDXTc)
  - Based on Fabian Giesen ("ryg")'s work. Original Homepage : http://farbrausch.com/~fg/code/index.html. This version is a faster variant, tested on x86 CPU. It is designed as a drop-in replacement of the original one. Therefore, interface is unchanged. rygCompress() — compress a texture, to DXT1 or DXT5 format; source must be provided in 32-bits RGBA format void rygCompress( unsigned char *dst, unsigned char *src, int w, int h, int isDxt5 ); unsigned char *dst Pointer to the Destination memory...
- [BinomialLLC/crunch: Advanced DXTc texture compression ... - GitHub](https://github.com/BinomialLLC/crunch/)
  - crnlib's differs significantly from other approaches because its compressed texture data format was carefully designed to be quickly transcodable directly to DXTn with no intermediate recompression step. The typical (single threaded) transcode to DXTn rate is generally between 100-250 megatexels/sec. The current library supports PC (Win32/x64) and Xbox 360. Fast random access to individual mipmap levels is supported. crnlib can also generates standard .DDS files at specified quality setting,...

## User

How reliable is the decode-dxt library for DXT compression

## Assistant

The decode-dxt library appears to be a reliable option for DXT decompression, particularly for DXT1-5 formats. Here are some key points about its reliability:

1. The library supports Block Compression 1, 2 and 3, which covers DXT1 through DXT5 formats.[3]

2. It works in both Node.js environments and browsers that support Typed Arrays, making it versatile for different use cases.[3]

3. The library provides a simple API for decoding DXT data to RGBA format, which is straightforward to use.[3]

4. It has been actively maintained, with the latest update (version 1.0.1) addressing specific issues like fixing black artifacts in some edge cases for BC2 and BC3 compression formats.[3]

5. The library is open-source and available on GitHub, allowing for community review and contributions.[3]

6. It can be easily integrated with other libraries, such as parse-dds, for handling DDS files.[3]

However, it's important to note a few limitations:

1. The library focuses solely on decoding (decompression) of DXT formats. It does not provide encoding (compression) functionality.[3]

2. While it supports DXT1-5, it may not cover more recent or specialized texture compression formats.

3. As with any third-party library, thorough testing in your specific use case is recommended to ensure it meets your performance and quality requirements.

Overall, for projects requiring DXT decompression, decode-dxt appears to be a reliable and well-maintained option, especially if you're working in a JavaScript environment. However, if you need both compression and decompression capabilities, or support for a wider range of formats, you might need to consider additional libraries or tools.

### Sources

- [Compressed texture formats (DXT1 DXT3 DXT5 etc)](https://www.gamedev.net/forums/topic/582176-compressed-texture-formats-dxt1-dxt3-dxt5-etc/)
  - I've been wondering about this for some time. As I understand (please correct me if I'm wrong), DXT compressed textures are compressed (lossy) in a way so they do not have to be decompressed before being send to gpu memory. In other words, if I have 4mb of raw image data, I will end up with 1mb of data after DXT5 compression and use up 1mb of graphics memory instead of 4mb. The performance impact of using DXT compression is near zero (in fact I've read it may be beneficial since it reduces the...
- [CPU based DXT compression - OpenGL - Khronos Forums](https://community.khronos.org/t/cpu-based-dxt-compression/73599)
  - I make no claim as to having done an image quality analysis on any of these libraries. But it seems to me that, to start with the assumption that image quality doesn’t matter seems to put a pretty big hole in your analysis. After all, DXT compressors only have two useful metrics: compression performance and image quality. If you decide that image quality is irrelevant, then naturally algorithms that prioritize image quality over performance will come out badly. So… you haven’t really proven...
- [Decoder for the DXT texture formats. - GitHub](https://github.com/kchapelier/decode-dxt)
  - Decoder for the DXT texture formats. Supports Block Compression 1, 2 and 3 (DXT1-5) Works in node and in browsers with Typed Array support... ## Example An example using decode-dxt with parse-dds to decode the first mipmap texture of a DDS file using a DXT format. var decodeDXT = require('decode-dxt'), parseDDS = require('parse-dds'); // parse the dds var ddsBuffer = new Uint8Array(... DDS file ...), ddsData = parseDDS(ddsBuffer); // get the first mipmap texture var image = ddsData.images,...

## User

RGBA to DXT5 converter source code

## Assistant

Based on your query about RGBA to DXT5 converter source code, here are some reliable options you can reference:

## RygsDXTc

This is a real-time DXT1/DXT5 compression library written in C. It provides a simple API for compressing RGBA data to DXT5 format:[1]

```c
void rygCompress(unsigned char *dst, unsigned char *src, int w, int h, int isDxt5);
```

To use it for DXT5 compression, you would set the `isDxt5` parameter to 1. The source data should be in 32-bit RGBA format, and the destination buffer needs to be pre-allocated with the correct size (which is srcSize / 4 for DXT5).[1]

## stb_dxt

This is a Python module for compressing and decompressing DXT1 and DXT5 textures. It provides functions for compressing RGBA data to DXT5:[2]

```python
from stb_dxt import *

compressed_data = compress_image_to_dxt5(rgba_data, width, height)
```

The module uses C libraries under the hood for performance, but provides a convenient Python interface.

## crunch

Crunch is an advanced DXTc texture compression library that supports DXT5 compression. While it focuses on its own .CRN format, it also supports standard DXT5 compression to .DDS files. Here's an example command line for compressing to DXT5:[5]

```
crunch -file input.tga -fileformat dds -dxt5
```

For programmatic use, crunch provides a C++ API:

```cpp
crn_comp_params comp_params;
// Set up comp_params...
comp_params.m_format = cCRNFmtDXT5;

crn_mipmap_params mip_params;
// Set up mip_params...

crn_uint32 compressed_size;
void *compressed_data = crn_compress(comp_params, mip_params, compressed_size);
```

These libraries provide different tradeoffs in terms of speed, quality, and ease of use. RygsDXTc is designed for real-time compression, stb_dxt offers a simple Python interface, while crunch provides high-quality compression with more advanced features. Choose the one that best fits your specific requirements and programming environment.

### Sources

- [GitHub - Cyan4973/RygsDXTc: Real-time DXT1/DXT5 texture compressor](https://github.com/Cyan4973/RygsDXTc)
  - Based on Fabian Giesen ("ryg")'s work. Original Homepage : http://farbrausch.com/~fg/code/index.html. This version is a faster variant, tested on x86 CPU. It is designed as a drop-in replacement of the original one. Therefore, interface is unchanged. rygCompress() — compress a texture, to DXT1 or DXT5 format; source must be provided in 32-bits RGBA format void rygCompress( unsigned char *dst, unsigned char *src, int w, int h, int isDxt5 ); unsigned char *dst Pointer to the Destination memory...
- [bensnell/stb_dxt: DXT Compression in Python - GitHub](https://github.com/bensnell/stb_dxt)
  - This repository is a python module for compressing and decompressing DXT1 (RGB) and DXT5 (RGBA) textures in python. It borrows heavily from ofxDXT, a library for OpenFrameworks. An important difference between ofxDXT and this module is that ofxDXT saves DXT files with a header indicating image size and DXT type, while this module saves no such header. As a result, the user must keep track of each saved file's image dimensions and DXT type. This library has been confirmed to work on Linux and...
- [GitHub - kchapelier/decode-dxt: Decoder for the DXT texture formats.](https://github.com/kchapelier/decode-dxt)
  - Decoder for the DXT texture formats. Supports Block Compression 1, 2 and 3 (DXT1-5) Works in node and in browsers with Typed Array support... ## Example An example using decode-dxt with parse-dds to decode the first mipmap texture of a DDS file using a DXT format. var decodeDXT = require('decode-dxt'), parseDDS = require('parse-dds'); // parse the dds var ddsBuffer = new Uint8Array(... DDS file ...), ddsData = parseDDS(ddsBuffer); // get the first mipmap texture var image = ddsData.images,...
- [Dtx5? - Texture Tools - NVIDIA Developer Forums](https://forums.developer.nvidia.com/t/dtx5/261479)
  - one more dumb question what in the drop down list is standard dtx5? tried bc3 did not work in quake 4 Hi @y2keeth! I looked around a bit (thank you to the Dhewm3 Mod Wiki), and I think Quake 4 mainly uses two formats: BC3 RGBA (aka DXT5) for textures with a smooth alpha channel: and BC1a RGBA (aka DXT1) for textures with either no alpha or with a binary alpha channel (i.e. every pixel is either fully opaque or fully transparent):... So, you could read an image, see how it was compressed in the...
- [GitHub - BinomialLLC/crunch: Advanced DXTc texture compression and transcoding library](https://github.com/BinomialLLC/crunch/)
  - The compression process employed in creating both .CRN and clustered .DDS files utilizes a very high quality, scalable DXTn endpoint optimizer capable of processing any number of pixels (instead of the typical hard coded 16), optional adaptive switching between several macroblock sizes/configurations (currently any combination of 4x4, 8x4, 4x8, and 8x8 pixel blocks), endpoint clusterization using top-down cluster analysis, vector quantization (VQ) of the selector indices, and several custom...
