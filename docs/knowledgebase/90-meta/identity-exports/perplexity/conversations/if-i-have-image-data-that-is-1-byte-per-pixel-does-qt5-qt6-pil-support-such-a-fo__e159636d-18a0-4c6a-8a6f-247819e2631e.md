---
source_url: "https://www.perplexity.ai/search/a90f2563-c53f-470a-a001-ea78a6de78bb"
thread_uuid: "e159636d-18a0-4c6a-8a6f-247819e2631e"
slug: "a90f2563-c53f-470a-a001-ea78a6de78bb"
title: "if I have image data that is 1 byte per pixel, does Qt5/Qt6/PIL support such a format, or do I specifically need to convert to RGB or another format? How widespread is support for greyscale as an image format between imaging libraries?"
extracted_at: "2026-06-29T16:22:59.677Z"
matched_keywords: []
export_suite: "identity"
entry_count: 5
provenance: perplexity-rest-api
---

# if I have image data that is 1 byte per pixel, does Qt5/Qt6/PIL support such a format, or do I specifically need to convert to RGB or another format? How widespread is support for greyscale as an image format between imaging libraries?

Source: [Perplexity thread](https://www.perplexity.ai/search/a90f2563-c53f-470a-a001-ea78a6de78bb)

## User

if I have image data that is 1 byte per pixel, does Qt5/Qt6/PIL support such a format, or do I specifically need to convert to RGB or another format? How widespread is support for greyscale as an image format between imaging libraries?

## Assistant

Support for 1 byte per pixel grayscale images is quite common among imaging libraries, including Qt and PIL (Python Imaging Library). Here's an overview of the support for grayscale images in these libraries and others:

## Qt5/Qt6 Support

Qt supports grayscale images through its QImage class:

- Qt provides the QImage::Format_Grayscale8 format, which represents 8-bit grayscale images (1 byte per pixel).[1]
- You can create a grayscale QImage directly or convert an existing image to grayscale using Qt's image processing functions.

## PIL Support

PIL (Python Imaging Library) and its fork Pillow fully support grayscale images:

- PIL uses the "L" mode to represent 8-bit grayscale images.[2]
- You can create grayscale images directly or convert other image formats to grayscale using the `convert("L")` method.

## Widespread Support

Support for grayscale images is widespread among imaging libraries:

**OpenCV**
- Supports 8-bit single-channel images, which are essentially grayscale.[3]
- You can create or convert to grayscale using `cv2.cvtColor()` with `cv2.COLOR_BGR2GRAY`.

**ImageMagick**
- Fully supports grayscale images and conversions.

**libjpeg, libpng, and other low-level libraries**
- Generally support grayscale formats natively.

## Advantages of Grayscale Format

1. **Smaller file size**: Grayscale images require less storage space compared to RGB images.
2. **Faster processing**: With fewer channels to process, operations on grayscale images are often quicker.
3. **Simplicity**: For certain applications, grayscale provides all necessary information without the complexity of color.

## Considerations

While grayscale support is common, there are a few things to keep in mind:

1. **Conversion may be necessary**: Some functions or algorithms might expect RGB input, requiring conversion.
2. **Display considerations**: Ensure your display pipeline correctly interprets grayscale data.
3. **Format compatibility**: When saving or transmitting images, ensure the chosen format supports grayscale (most common formats do).

In conclusion, if you have 1 byte per pixel grayscale image data, you can generally use it directly in Qt, PIL, and many other imaging libraries without needing to convert to RGB. The widespread support for grayscale images means you can often work with this format efficiently across various tools and libraries in the image processing ecosystem.

### Sources

- [Bitonal vs. Grayscale | Which Should You Choose?](https://bmiimaging.com/blog/document-management/bitonal-vs-grayscale/)
  - You have three choices of image capture methods when you decide to digitize your records: bitonal, grayscale, and color. Bitonal Bitonal, or black & white, scanning is the base method of creating digital images. When your hard copy records are scanned, the data is presented as pixels on a digital image. The pixels on the image are identified as either black or white. Grayscale Grayscale scanning provides for 256 shades of gray in each pixel, giving images much smoother transitions from white...
- [Grayscale Images | Raster imaging C++ Class Library Help](https://www.leadtools.com/help/sdk/main/clib/grayscale-images.html)
  - LEADTOOLS provides a number of functions for working with grayscale images. Many of these functions work on either grayscale images or color images. Some of the LEADTOOLS functions however, are designed specifically for use with grayscale images, either creating a grayscale image, getting information about a grayscale image, or window leveling. A color image can be converted to a grayscale image using the LBitmapBase::GrayScale and LBitmapBase::ConvertToGrayScale functions. The...
- [Grayscale Images | Raster, Medical, Document Help](https://www.leadtools.com/help/sdk/v21/dh/to/grayscale-images.html)
  - LEADTOOLS for .NET provides a number of classes/methods for working with grayscale images. Many of these classes/methods work on either grayscale images or color images. Some of the LEADTOOLS classes/methods however, are designed specifically for use with grayscale images: either creating a grayscale image, getting information about a grayscale image, or window-leveling. Creating and Working with Grayscale Images A color image can be converted to a grayscale image using the GrayscaleCommand...
- [A Guide to Converting Images to Grayscale with Python Introduction](https://cloudinary.com/guides/image-effects/a-guide-to-converting-images-to-grayscale-with-python-introduction)
  - Grayscale images, also known as black-and-white or monochrome images, are images with shades of gray from black to white, with each pixel having a single intensity value. Grayscale images are widely used in various applications such as image enhancement, compression, and feature extraction. Below is an example of a grayscale image: *Image Credits: Jocelyn Morales on Unsplash* There are extensive libraries and tools in Python for converting colored images into grayscale. Examples include PIL...
- [Image Processing: Comparison & Analysis of Image Formats](https://www.ijraset.com/research-paper/image-processing-comparison-and-analysis-of-image-formats)
  - As technology is growing drastically day by day, undoubtedly there is a rapid increase in demand for image processing in every field. Each day billions of images are clicked. Collecting and analyzing those images may give us amazing results in our real-time applications. There are many different applications of image processing in the areas of space, medical, traffic, and banking, such as planet discovery, brain tumor detection, fraud detection, and object detection, etc. The objective of this...

## User

How about BGRA/BGR?

## Assistant

Based on the search results, support for BGRA/BGR formats varies across different imaging libraries:

1. PIL/Pillow:
   - Does not natively support BGRA/BGR formats.
   - There is an open feature request for adding BGRA support.[1]
   - You can use PIL.Image.frombytes with the 'raw' decoder to load BGRA data, but this is not a standard mode.[1]

2. OpenCV:
   - Natively uses BGR format when reading images with cv2.imread().[3]
   - Provides cv2.cvtColor() function to convert between BGR and RGB.[9][3]

3. Qt:
   - Supports BGRA formats in QVideoFrameFormat.[5]
   - QImage supports various BGR formats like Format_BGR888, Format_BGRA8888, etc..[8]

4. Vulkan:
   - Often uses BGRA format for swapchain images as it's common for display controllers to work with BGRA.[6]

5. Other libraries:
   - Many image processing libraries support BGR/BGRA formats due to historical reasons (VGA used BGR) and Windows expecting BGR by default.[6]

To work with BGRA/BGR data across different libraries, you may need to:

1. Use library-specific functions to load or convert to BGRA/BGR when needed.
2. Convert between RGB and BGR/BGRA when switching between libraries that use different default formats.
3. Be aware of the color channel order when processing pixel data directly.

If you're working with grayscale (1 byte per pixel) images, most libraries support this format natively:

- PIL/Pillow supports grayscale with the "L" mode.[8]
- OpenCV supports 8-bit single-channel images for grayscale.[2]
- Qt supports grayscale with QImage::Format_Grayscale8.[8]

In general, grayscale support is widespread and you shouldn't need to convert to RGB/BGR for most operations with common imaging libraries.

### Sources

- [Feature request "BGRA" mode #7537 - python-pillow/Pillow - GitHub](https://github.com/python-pillow/Pillow/issues/7537)
  - You say that what you have to do at the moment is slow. Could you provide example code to demonstrate? Sorry, something went wrong. You can import BGRA data when you are dealing with it using PIL.Image.frombytes or PIL.Image.Image.frombytes. PIL.Image.frombytes PIL.Image.Image.frombytes (Especially processing overhead where Python loops are involved, it really slows things down.) (Especially processing overhead where Python loops are involved, it really slows things down.) I believe you don't...
- [Image Manipulation with CUDA - dusty-nv/jetson-inference - GitHub](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-image.md)
  - Format stringimageFormat enumData TypeBit Depth RGB/RGBArgb8IMAGE_RGB8uchar324 rgba8IMAGE_RGBA8uchar432 rgb32fIMAGE_RGB32Ffloat396 rgba32fIMAGE_RGBA32Ffloat4128 BGR/BGRAbgr8IMAGE_BGR8uchar324 bgra8IMAGE_BGRA8uchar432 bgr32fIMAGE_BGR32Ffloat396... bayer-gbrgIMAGE_BAYER_GBRGuint88 bayer-grbgIMAGE_BAYER_GRBGuint88 bayer-rggbIMAGE_BAYER_RGGBuint88 Grayscalegray8IMAGE_GRAY8uint88 gray32fIMAGE_GRAY32Ffloat32 The bit depth represents the effective number of bits per pixel For detailed specifications...
- [Convert BGR and RGB with Python - OpenCV - GeeksforGeeks](https://www.geeksforgeeks.org/convert-bgr-and-rgb-with-python-opencv/)
  - Convert BGR and RGB with Python – OpenCV Last Updated : 03 Jan, 2023 Summarize Comments Improve Suggest changes Like Article Like Save Share Report Follow Prerequisites: OpenCV OpenCV is a huge open-source library for computer vision, machine learning, and image processing. OpenCV supports a wide variety of programming languages like Python, C++, Java, etc. It can process images and videos to identify objects, faces, or even the handwriting of a human. In this article, we will convert a BGR...
- [Texture pixel formats - OpenGL: Advanced Coding - Khronos Forums](https://community.khronos.org/t/texture-pixel-formats/46136)
  - I already answered this. BGR is preferable to RGB and BGRA is prefered over RGBA on windows. Quite a lot of image format are stored BGR or BGRA. So you dont need to flip bytes before uploading. It does both because the drivers swaps bytes for you if you dont match the internal format. Your source should match the internal format. Some vendors like intel sis and such dont have detailed documents. Just advertisements. Maybe someone can post some links to their docs? Thanks in advance. I can...
- [QVideoFrameFormat Class | Qt Multimedia 6.8.0](https://doc.qt.io/qt-6/qvideoframeformat.html)
  - QVideoFrameFormat::ColorTransfer_BT6012Color values are encoded according to BT601. See also https://www.itu.int/rec/R-REC-BT.601/en. QVideoFrameFormat::ColorTransfer_Linear3Color values are linear QVideoFrameFormat::ColorTransfer_Gamma224Color values are encoded with a gamma of 2.2 QVideoFrameFormat::ColorTransfer_Gamma285Color values are encoded with a gamma of 2.8... QVideoFrameFormat::ColorTransfer_STD_B677Color values are encoded using ARIB STD B67. This transfer function is also often...
- [Why use BGRA instead of RGBA? : r/vulkan - Reddit](https://www.reddit.com/r/vulkan/comments/p3iy0o/why_use_bgra_instead_of_rgba/)
  - Why use BGRA instead of RGBA? I'm following vulkan-tutorial.com and I don't understand why when creating the swap chain, we choose a VkSurfaceFormatKHR with a format of VK_FORMAT_B8G8R8A8_SRGB instead of VK_FORMAT_R8G8B8A8_SRGB which is the common type and simpler to work with to my beginner eyes. Is there any untold reason why? Is this the actual standard in graphics programming? Thanks It is quite common that the display controller in your GPU works with BGRA, not RGBA. So you get your...
- [Image file reading and writing - OpenCV](https://docs.opencv.org/3.4/d4/da8/group__imgcodecs.html)
  - OpenCV 3.4.20-dev Open Source Computer Vision ## Modules C API Flags used for image file reading and writing iOS glue ## Functions Matcv::imdecode (InputArray buf, int flags) Reads an image from a buffer in memory. More... Matcv::imdecode (InputArray buf, int flags, Mat *dst)... boolcv::imencode (const String &ext, InputArray img, std::vector< uchar > &buf, const std::vector< int > ¶ms=std::vector< int >()) Encodes an image into a memory buffer. More... Matcv::imread (const String &filename,...
- [QImage Class | Qt GUI 6.8.0](https://doc.qt.io/qt-6/qimage.html)
  - QImage::Format_RGBA8888 (since Qt 5.2)17The image is stored using a 32-bit byte-ordered RGBA format (8-8-8-8). Unlike ARGB32 this is a byte-ordered format, which means the 32bit encoding differs between big endian and little endian architectures, being respectively (0xRRGGBBAA) and (0xAABBGGRR). The order of the colors is the same on any architecture if read as bytes 0xRR,0xGG,0xBB,0xAA. QImage::Format_RGBA8888_Premultiplied (since Qt 5.2)18The image is stored using a premultiplied 32-bit...
- [Convert BGR and RGB with Python, OpenCV (cvtColor) - nkmk note](https://note.nkmk.me/en/python-opencv-bgr-rgb-cvtcolor/)
  - When the image file is read with the OpenCV function imread(), the order of colors is BGR (blue, green, red). On the other hand, in Pillow, the order of colors is assumed to be RGB (red, green, blue). Therefore, if you want to use both the Pillow function and the OpenCV function, you need to convert BGR and RGB. You can use the OpenCV function cvtColor() or simply change the order of ndarray. This article describes the following contents. OpenCV is BGR, Pillow is RGB Convert BGR and RGB with...
- [Image file formats - Pillow (PIL Fork) 11.0.0 documentation](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html)
  - BLP is the Blizzard Mipmap Format, a texture format used in World of Warcraft. Pillow supports reading JPEG Compressed or raw BLP1 images, and all types of BLP2 images. Pillow supports writing BLP images. The method can take the following keyword arguments: blp_version If present and set to “BLP1”, images will be saved as BLP1. Otherwise, images will be saved as BLP2.... ### BMP¶ Pillow reads and writes Windows and OS/2 BMP files containing 1, L, P, or RGB data. 16-colour images are read as P...

## User

Only asking about Qt5/Qt6. I do not seem to have a Format_BGRA8888 available. Does it not support it? I have found BGR888 and it seems odd that it wouldn't have the other if it does indeed have one.

## Assistant

Based on the search results and the context of your query, let's clarify the situation regarding BGRA8888 and BGR888 formats in Qt5 and Qt6:

1. Qt6 Support:
   In Qt6, the BGRA8888 format is indeed supported. The `QVideoFrameFormat` enum includes:[3]
   - `QVideoFrameFormat::Format_BGRA8888`
   - `QVideoFrameFormat::Format_BGRA8888_Premultiplied`

   Additionally, for QImage, Qt6 supports:[2]
   - `QImage::Format_ARGB32` (which is effectively BGRA8888 on little-endian systems)
   - `QImage::Format_BGR888` (added since Qt 5.14)

2. Qt5 Support:
   In Qt5, the support was similar, but there were some differences in naming and availability:
   - `QVideoFrame::Format_ARGB32` (equivalent to BGRA8888 on little-endian systems)
   - `QImage::Format_ARGB32`
   - `QImage::Format_BGR888` (added in Qt 5.14)

The fact that you can't find `Format_BGRA8888` might be due to a few reasons:

1. You might be using an older version of Qt that doesn't include this specific format name.
2. You might be looking in the wrong class (QImage vs QVideoFrame/QVideoFrameFormat).
3. There might be a difference in how the format is named or accessed in your specific Qt version.

It's worth noting that Qt6 made some changes to video handling, which is why you see differences between QVideoFrame in Qt5 and QVideoFrameFormat in Qt6.[1][3]

If you're specifically looking for BGRA8888 support and can't find it, you have a few options:

1. Use `Format_ARGB32` on little-endian systems, which is effectively BGRA8888.
2. Use `Format_BGR888` and handle the alpha channel separately if needed.
3. Convert your image data to a format that is explicitly supported in your Qt version.

If you're still unable to find the format you need, it would be helpful to know your exact Qt version and which class you're looking at (QImage, QVideoFrame, or QVideoFrameFormat) to provide more specific guidance.

### Sources

- [There is no Format_RGB24 in qt6 - Stack Overflow](https://stackoverflow.com/questions/69618525/there-is-no-format-rgb24-in-qt6)
  - In QT5 we have QVideoFrame::Format_RGB24 format (i have RGB images without alpha channel). In QT6 (6.2.0) this format is missing. Why this format has been removed? What's the best way to convert RGB -> RGBX (A) in QT6? In QT5 we have QVideoFrame::Format_RGB24 format (i have RGB images without alpha channel). In QT6 (6.2.0) this format is missing. Why this format has been removed? What's the best way to convert RGB -> RGBX (A) in QT6? If you are using QImage (or you can convert it to QImage)...
- [QImage Class | Qt GUI 6.8.0](https://doc.qt.io/qt-6/qimage.html)
  - FormatDescriptionQt's support BMPWindows BitmapRead/write GIFGraphic Interchange Format (optional)Read JPGJoint Photographic Experts GroupRead/write JPEGJoint Photographic Experts GroupRead/write PNGPortable Network GraphicsRead/write PBMPortable BitmapRead PGMPortable GraymapRead PPMPortable PixmapRead/write XBMX11 BitmapRead/write XPMX11 PixmapRead/write... QImage::Format_RGB6669The image is stored using a 24-bit RGB format (6-6-6). The unused most significant bits is always zero....
- [QVideoFrameFormat Class | Qt Multimedia 6.8.0](https://doc.qt.io/qt-6/qvideoframeformat.html)
  - enumColorRange { ColorRange_Unknown, ColorRange_Video, ColorRange_Full } enumColorSpace { ColorSpace_Undefined, ColorSpace_BT601, ColorSpace_BT709, ColorSpace_AdobeRgb, ColorSpace_BT2020 } enumColorTransfer { ColorTransfer_Unknown, ColorTransfer_BT709, ColorTransfer_BT601, ColorTransfer_Linear, ColorTransfer_Gamma22, â€¦, ColorTransfer_STD_B67 } enumDirection { TopToBottom, BottomToTop } enumPixelFormat { Format_Invalid, Format_ARGB8888, Format_ARGB8888_Premultiplied, Format_XRGB8888,...
- [Qt 6.2 vs. Qt 5.15 – The Feature Parity Comparison](https://www.qt.io/blog/qt-6.2-vs.-qt-5.15-the-feature-parity-comparison)
  - Qt 6.2 vs. Qt 5.15 – The Feature Parity Comparison September 02, 2021 by Peter Schneider Comments The Qt Company recently compared the latest Long Term Releases Qt 5.15 and Qt 6.2 of its software development platform consisting of design, development, and quality assurance applications plus various software libraries, referred to in this post as modules. This blog post, intended particularly for product and R&D leaders, summarizes the main findings of the comparison. Comparing two major...

## User

in Pillow, how to convert between Greyscale, BGRA, RGBA, RGB, and RGBA?

## Assistant

Based on the search results and Pillow's documentation, here's how you can convert between different color modes in Pillow:

## Converting to Grayscale

To convert an image to grayscale, use the `convert()` method with the "L" mode:

```python
from PIL import Image

# Open the image
image = Image.open("input_image.png")

# Convert to grayscale
grayscale_image = image.convert("L")

# Save the grayscale image
grayscale_image.save("grayscale_image.png")
```

## Converting between RGB, RGBA, and BGR

Pillow natively supports RGB and RGBA modes, but not BGR or BGRA. Here's how to handle these conversions:

1. RGB to RGBA:
```python
rgba_image = rgb_image.convert("RGBA")
```

2. RGBA to RGB:
```python
rgb_image = rgba_image.convert("RGB")
```

3. For BGR and BGRA, you need to use the raw decoder:

```python
# BGR to RGB
rgb_image = Image.frombytes("RGB", bgr_image.size, bgr_image.tobytes(), "raw", "BGR")

# BGRA to RGBA
rgba_image = Image.frombytes("RGBA", bgra_image.size, bgra_image.tobytes(), "raw", "BGRA")
```

4. To convert back to BGR or BGRA, you can swap the channels:

```python
import numpy as np

# RGB to BGR
bgr_array = np.array(rgb_image)[:, :, ::-1]
bgr_image = Image.fromarray(bgr_array)

# RGBA to BGRA
bgra_array = np.array(rgba_image)[:, :, [2, 1, 0, 3]]
bgra_image = Image.fromarray(bgra_array)
```

## Important Notes:

1. Pillow doesn't have native BGRA or BGR modes, so you need to use the raw decoder or numpy for these conversions.[2]

2. When converting between color modes, be aware that some color information may be lost, especially when going from a mode with more channels to one with fewer channels.

3. The `convert()` method is the most straightforward way to change between supported modes in Pillow.

4. For grayscale images, Pillow uses the "L" mode, which represents 8-bit grayscale.[1]

5. When working with GIF files, Pillow may automatically convert images to RGB or RGBA when seeking through frames, due to the limitations of the palette mode.[3]

Remember that these conversions may have performance implications, especially when dealing with large images or processing many images. Always consider the specific requirements of your project when choosing color modes and conversion methods.

### Sources

- [A Guide to Converting Images to Grayscale with Python Introduction | Cloudinary](https://cloudinary.com/guides/image-effects/a-guide-to-converting-images-to-grayscale-with-python-introduction)
  - Grayscale images, also known as black-and-white or monochrome images, are images with shades of gray from black to white, with each pixel having a single intensity value. Grayscale images are widely used in various applications such as image enhancement, compression, and feature extraction. Below is an example of a grayscale image: *Image Credits: Jocelyn Morales on Unsplash* There are extensive libraries and tools in Python for converting colored images into grayscale. Examples include PIL...
- [Feature request "BGRA" mode · Issue #7537 · python-pillow/Pillow](https://github.com/python-pillow/Pillow/issues/7537)
  - You say that what you have to do at the moment is slow. Could you provide example code to demonstrate? Sorry, something went wrong. You can import BGRA data when you are dealing with it using PIL.Image.frombytes or PIL.Image.Image.frombytes. PIL.Image.frombytes PIL.Image.Image.frombytes (Especially processing overhead where Python loops are involved, it really slows things down.) (Especially processing overhead where Python loops are involved, it really slows things down.) I believe you don't...
- [Image file formats](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html)
  - Pillow reads GIF87a and GIF89a versions of the GIF file format. The library writes files in GIF87a by default, unless GIF89a features are used or GIF89a is already in use. Files are written with LZW encoding. GIF files are initially read as grayscale ( L) or palette mode ( P) images. Seeking to later frames in a P image will change the image to RGB (or RGBA if the first frame had transparency). P mode images are changed to RGB because each frame of a GIF may contain its own individual palette...

## User

Explain block-based compression, then specifically explain how this is compressed? is DXT1/DXT5 a lossy compression format? What is a block? The phrase """Block-based compression is a technique used to compress data by dividing it into fixed-size blocks and encoding each block separately.""" is not explanatory enough, explain the low-level logic.

## Assistant

Block-based compression is a technique that divides data into fixed-size blocks and compresses each block independently. Here's a more detailed explanation of how it works, particularly for DXT compression:

1. Block structure:
   - In DXT compression, a "block" is typically a 4x4 pixel area of an image.
   - Each block is compressed separately, allowing for localized optimization.

2. DXT1 compression process:
   - For each 4x4 block:
     a. Find two "endpoint" colors that represent the color range in the block.
     b. Store these two colors in RGB565 format (16 bits each).
     c. Generate two additional colors by interpolating between the endpoints.
     d. For each pixel in the block, store a 2-bit index (0-3) indicating which of the four colors best represents it.
   - This results in 64 bits (8 bytes) per 4x4 block, achieving an 8:1 compression ratio.

3. DXT5 compression process:
   - Similar to DXT1, but adds alpha channel compression:
     a. Perform DXT1 compression for color data.
     b. Find two "endpoint" alpha values for the block.
     c. Generate six additional alpha values by interpolation.
     d. For each pixel, store a 3-bit index (0-7) for alpha.
   - This results in 128 bits (16 bytes) per 4x4 block, achieving a 4:1 compression ratio.

4. Lossy nature:
   - DXT1 and DXT5 are indeed lossy compression formats.
   - The color and alpha quantization process introduces some loss of information.
   - The interpolation between endpoint colors can cause visible artifacts, especially in areas with smooth gradients.

5. Low-level logic:
   - Color quantization: The algorithm analyzes the 16 pixels in each block to find the two most representative colors.
   - Interpolation: It creates additional colors by linear interpolation between the endpoints.
   - Index assignment: Each pixel is assigned the index of the closest color from the generated palette.
   - Bit packing: The endpoint colors and indices are packed into a specific bit layout for efficient storage and hardware decoding.

6. Advantages:
   - Fast decompression: GPUs can efficiently decode DXT-compressed textures.
   - Reduced memory usage and bandwidth: Compressed textures take up less space and require less data transfer.

7. Limitations:
   - Not suitable for all image types: Can produce noticeable artifacts in images with smooth gradients or sharp color transitions.
   - Fixed block size: The 4x4 block structure can lead to visible block boundaries in some cases.

Block-based compression, as used in DXT, balances compression efficiency with fast, hardware-accelerated decompression, making it particularly suitable for real-time graphics applications like video games.

### Sources

- [Block-Based Compression and Corresponding Hardware Circuits ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC8622461/)
  - In this paper, to exploit both the sparsity and the similarity of activation values, we develop a block-based compression approach (i.e., block-based compression format) to store activation values. Furthermore, to support the proposed block-based compression format, we also develop an encoder, a decoder and an indexing module. The encoder is used to translate output activations into the proposed block-based compression format. Both the decoder and the indexing module are used to align nonzero...
- [Block compression - UWP applications | Microsoft Learn](https://learn.microsoft.com/en-us/windows/uwp/graphics-concepts/block-compression)
  - Block compression Block compression is a lossy texture-compression technique for reducing texture size and memory footprint, giving a performance increase. A block-compressed texture can be smaller than a texture with 32-bits per color. Block compression is a texture compression technique for reducing texture size. When compared to a texture with 32-bits per color, a block-compressed texture can be up to 75 percent smaller. Applications usually see a performance increase when using block...
- [Block-Based Compression and Corresponding Hardware Circuits ...](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8622461/)
  - In a CNN (convolutional neural network) accelerator, to reduce memory traffic and power consumption, there is a need to exploit the sparsity of activation values. Therefore, some research efforts have been paid to skip ineffectual computations (i.e., multiplications by zero). Different from previous works, in this paper, we point out the similarity of activation values: (1) in the same layer of a CNN model, most feature maps are either highly dense or highly sparse; (2) in the same layer of a...
- [Block compression - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/direct2d/block-compression?redirectedfrom=MSDN)
  - Starting with Windows 8.1, Direct2D supports several block compressed pixel formats. In addition, Windows 8.1 contains a new Windows Imaging Component (WIC) DDS codec to enable loading and storing block compressed images in the DDS file format. Block compression is a technique for reducing the amount of graphics memory that is consumed by bitmap content. By using block compression, your app can reduce memory consumption and load times for the same resolution images. Or, your app can use more...
- [DXT Compression - TrainzOnline - TS2009](https://online.ts2009.com/mediaWiki/index.php/DXT_Compression)
  - DXT Compression DXT Compression is considered a "lossless" compression because almost no pixel data is lost in the compression process. Some subtle colour detail may disappear as the colours are stored as 16 bit RGB 5,6,5 rather than 24 bit RGB 8,8,8. The following are the DXT formats used in the Trainz (N3V) binary textures. Contents DXT1 Compression DXT1 stores 16 input pixels in 64 bits of output, consisting of two 16-bit RGB 5:6:5 colour values and a 4x4 two bit lookup table. If the first...
- [[PDF] The Block Lossless Data Compression Algorithm](http://paper.ijcsns.org/07_book/200910/20091015.pdf)
  - contexts. The algorithm significantly improves the compression performance of the character oriented PPM, especially in lower orders (up to 8). Table 3 and table 4 show results of experiments with block PPMVC algorithm. The experiments were carried out using PPMVC ver. 1.2 (default mode). The results presented in table 3 and 4 indicate that a reduced block size may result in lower compression ratio, and the no blocking mode of PPMVC gives the best compression. From the point of practical use,...
- [Why DXT5 is default texture format, when DXT1 takes less size?](https://discussions.unity.com/t/why-dxt5-is-default-texture-format-when-dxt1-takes-less-size/857240)
  - both are lossless i dont get it? is there any unwritten reason? nvm the answer to this id that dxt1 is rgb only not rgba… but i guess it still may be useful sometimes dxt1 has 1 bit alpha channel. That is “ouch”. Also, you’re mistaken. Both of those formats are lossy. They’re not lossless. Compression to dxt produces artifacts. Technically true, though Unity will never itself compress textures using that encoding. So that only matters if you’re a sadist and want to compress all of your...
- [Fast CPU DXT Compression - Intel](https://www.intel.com/content/www/us/en/developer/articles/technical/fast-cpu-dxt-compression.html)
  - DXT compression is a lossy texture compression algorithm that can reduce texture storage requirements and decrease texture bandwidth. DXT decompression is typically hardware accelerated, which makes it very fast and efficient. DXT textures are usually compressed offline and consumed at runtime. However, it is sometimes necessary to perform DXT compression during runtime. For example, a more efficient texture compression algorithm can be used to store textures on disk. When the textures are...
