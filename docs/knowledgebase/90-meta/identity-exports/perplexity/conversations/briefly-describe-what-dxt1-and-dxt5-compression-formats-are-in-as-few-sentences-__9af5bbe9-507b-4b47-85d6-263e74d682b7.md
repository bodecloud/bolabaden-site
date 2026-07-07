---
source_url: "https://www.perplexity.ai/search/3cfdb2ae-0a5c-4293-a822-a9583f9b98ef"
thread_uuid: "9af5bbe9-507b-4b47-85d6-263e74d682b7"
slug: "3cfdb2ae-0a5c-4293-a822-a9583f9b98ef"
title: "briefly describe what DXT1 and DXT5 compression formats are in as few sentences as possible."
extracted_at: "2026-06-29T16:22:10.283Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# briefly describe what DXT1 and DXT5 compression formats are in as few sentences as possible.

Source: [Perplexity thread](https://www.perplexity.ai/search/3cfdb2ae-0a5c-4293-a822-a9583f9b98ef)

## User

briefly describe what DXT1 and DXT5 compression formats are in as few sentences as possible.

## Assistant

DXT1 and DXT5 are texture compression formats used in computer graphics:

DXT1 compresses a 4x4 block of pixels into 64 bits, providing a 6:1 compression ratio for RGB data. It supports either fully opaque textures or those with 1-bit (on/off) transparency.[1][3]

DXT5 compresses a 4x4 block of pixels into 128 bits, offering a 4:1 compression ratio for RGBA data. It provides higher quality alpha channel compression compared to DXT1, supporting smooth gradients in transparency.[3][4][1]

### Sources

- [DirectX Texture Compression 5 - Valve Developer Community](https://developer.valvesoftware.com/wiki/DirectX_Texture_compression_5)
  - DirectX Texture compression 5, or DXT5, is a variation of the S3TC (S3 Texture Compression) image compression algorithm included in DirectX (since DX 6.0). DXT5 is also the Vtex compile parameter used to utilize this algorithm even if there is no alpha channel in the source image. DXT5 converts a 4x4 block of pixels into 128 bits of output (consisting of 64 bits of alpha channel data (two 8 bit alpha values and a 4x4 3 bit lookup table) followed by 64 bits of encoded color data) resulting in a...
- [DXT - Polycount Wiki](http://wiki.polycount.com/wiki/DXT)
  - DXT DXT is a texture compression format, formerly known as S3TC. DXT is widely supported on current graphics hardware, meaning it will stay compressed in video memory, allowing the artist to use more or larger textures. There are five DXT formats: DXT1, DXT2, DXT3, DXT4, and DXT5. In DirectX 10 it is known as Block Compression and comes in five basic flavors: BC1, BC2, BC3, BC4, and BC5. The DXT compression format can be stored inside many container files like DDS, VTF, etc. but DDS is the...
- [S3 Texture Compression - Wikipedia](https://en.wikipedia.org/wiki/S3_Texture_Compression)
  - DXT1 through DXT5, referring to the FourCC code assigned by Microsoft to each format), each designed for specific types of image data. All convert a 4×4 block of pixels to a 64-bit or 128-bit quantity, resulting in compression ratios of 6:1 with 24-bit RGB input data or 4:1 with 32-bit RGBA input data. S3TC is a lossy compression algorithm, resulting in image quality degradation, an effect which is minimized by the ability to increase texture resolutions while maintaining the same memory...
- [Why DXT5 is default texture format, when DXT1 takes less size?](https://discussions.unity.com/t/why-dxt5-is-default-texture-format-when-dxt1-takes-less-size/857240)
  - both are lossless i dont get it? is there any unwritten reason? nvm the answer to this id that dxt1 is rgb only not rgba… but i guess it still may be useful sometimes dxt1 has 1 bit alpha channel. That is “ouch”. Also, you’re mistaken. Both of those formats are lossy. They’re not lossless. Compression to dxt produces artifacts. Technically true, though Unity will never itself compress textures using that encoding. So that only matters if you’re a sadist and want to compress all of your...
- [DXT compression explained - FSDeveloper Wiki](https://www.fsdeveloper.com/wiki/index.php/DXT_compression_explained)
  - Since the introduction of the compressed DXT texture types in Flight Simulator, choosing the right type of compression has often lead to discussion. What are the differences between DXT1 and DXT3 for example? The latter one gives me a bigger filesize, so does that not mean better quality of my texture? This article hopes to explain the differences between the different formats, so that you can make a good choice which compression to use. Also will it explain how the compression itself works,...
