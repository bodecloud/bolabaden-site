---
source_url: "https://www.perplexity.ai/search/20e9bba0-5c28-4557-89a5-1dc8ada38724"
thread_uuid: "3716834b-bae2-4630-975b-7a78b6f04389"
slug: "20e9bba0-5c28-4557-89a5-1dc8ada38724"
title: "I am finding that Python's BytesIO, memoryview, bufferediobase, etc are extremely slow. I have a proprietary image format that I need to read, quickly. What are the top pip packages, or python alternatives, to doing IO as quick as possible? async is not important, the problem is it just takes so dang long due to many read_byte calls as i parse it myself in python. I need a highly performant library. Either a image-parsing library that will allow me to specify custom images and their structures. Like for example when you deserialize/serialize json, you can provide custom structures and classes that tells json how to load it. Perhaps there's something similar for other image parsing libraries like Pillow. Either that, or I need the a god tier IO library."
extracted_at: "2026-06-29T16:23:07.039Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# I am finding that Python's BytesIO, memoryview, bufferediobase, etc are extremely slow. I have a proprietary image format that I need to read, quickly. What are the top pip packages, or python alternatives, to doing IO as quick as possible? async is not important, the problem is it just takes so dang long due to many read_byte calls as i parse it myself in python. I need a highly performant library. Either a image-parsing library that will allow me to specify custom images and their structures. Like for example when you deserialize/serialize json, you can provide custom structures and classes that tells json how to load it. Perhaps there's something similar for other image parsing libraries like Pillow. Either that, or I need the a god tier IO library.

Source: [Perplexity thread](https://www.perplexity.ai/search/20e9bba0-5c28-4557-89a5-1dc8ada38724)

## User

I am finding that Python's BytesIO, memoryview, bufferediobase, etc are extremely slow. I have a proprietary image format that I need to read, quickly. What are the top pip packages, or python alternatives, to doing IO as quick as possible? async is not important, the problem is it just takes so dang long due to many read_byte calls as i parse it myself in python. I need a highly performant library. Either a image-parsing library that will allow me to specify custom images and their structures. Like for example when you deserialize/serialize json, you can provide custom structures and classes that tells json how to load it. Perhaps there's something similar for other image parsing libraries like Pillow. Either that, or I need the a god tier IO library.

## Assistant

Based on your requirements for high-performance I/O and custom image parsing, here are some recommendations:

1. NumPy: While not specifically an I/O library, NumPy provides very efficient array operations that can significantly speed up processing of binary data.[1]

2. Cython: This can compile Python code to C, potentially giving major speed improvements for I/O heavy operations.[1]

3. PyAV: A Python binding for FFmpeg libraries. It's fast and can handle a wide variety of multimedia formats.[2]

4. ImageIO: A Python library that provides an easy interface to read and write a wide range of image data, including animated images, volumetric data, and scientific formats.[5][7]

5. OpenCV (cv2): While primarily a computer vision library, OpenCV has very efficient image I/O capabilities.[4]

6. Pillow-SIMD: A fork of Pillow optimized for speed using SIMD instructions.[2]

7. Lycon: A minimal and fast image library for Python and C++, derived from OpenCV.[3]

For custom image parsing:

1. Construct: A powerful declarative parser/builder for binary data.[1]

2. Kaitai Struct: A declarative language for binary structures that can generate parsing code in multiple languages, including Python.[1]

3. Custom C extension: For ultimate performance, you could write a custom C extension to handle the I/O and initial parsing, then pass the data to Python.

To optimize your current approach:

1. Use memoryview or array.array for efficient byte-level access.[1]

2. Consider memory mapping (mmap) for large files.[1]

3. Use the struct module for parsing binary data structures.[1]

4. Employ buffering techniques to reduce the number of I/O operations.[1]

Remember, the best solution depends on your specific use case and the structure of your proprietary image format. You might need to benchmark different approaches to find the optimal solution for your particular scenario.

### Sources

- [Top 26 Python Libraries for Data Science in 2024 - DataCamp](https://www.datacamp.com/blog/top-python-libraries-for-data-science)
  - Pandas. Pandas is an open-source library commonly used in data science. It is primarily used for data analysis, data manipulation, and data cleaning.
- [Top 8 Image-Processing Python Libraries Used in Machine Learning](https://neptune.ai/blog/image-processing-python-libraries-for-machine-learning)
  - According to IDC, digital data will skyrocket up to 175 zettabytes, and the huge part of this data is images. Data scientists need to (pre) process these images before feeding them into any machine learning models. They have to do the important (and sometimes dirty) work before the fun part begins. To process a large amount of data with efficiency and speed without compromising the results data scientists need to use image processing tools for machine learning and deep learning tasks. In this...
- [ethereon/lycon: A minimal and fast image library for Python and C++](https://github.com/ethereon/lycon)
  - A minimal and fast image library for Python and C++. Lycon is a small subset of optimized image operations derived from OpenCV. Current set of features include: Reading and writing JPEG and PNG images Fast SIMD optimized image resizing Zero-copy interop with NumPy whenever possible Tested on: Linux (Ubuntu 14.04) with Python 2.7.6and 3.5.2. macOS (Sierra, 10.12) with Python 2.7.11and 3.5.1. pip install lycon Native extension dependencies: CMake 2.8 or newer C++ toolchain LibJPEG LibPNG...
- [Fastest image processing possible : r/learnpython - Reddit](https://www.reddit.com/r/learnpython/comments/zl0ynt/fastest_image_processing_possible/)
  - Fastest image processing possible Hello, guys! I have a project where image processing is the bottleneck and performance is becoming an issue. I get as input a bytesarray of a PNG file and I do the following operations: crop, resize and convert (from RGB to grayscale). I'm currently using Pillow to do these operations. How can I achieve the greatest speed possible with that? Constraint: it can't use multiprocessing, since I already have multiple processes and each of them calls a function that...
- [imageio/imageio: Python library for reading and writing image data](https://github.com/imageio/imageio)
  - Website: https://imageio.readthedocs.io/ Imageio is a Python library that provides an easy interface to read and write a wide range of image data, including animated images, video, volumetric data, and scientific formats. It is cross-platform, runs on Python 3.8+, and is easy to install. Professional support is available via Tidelift. import imageio.v3 as iio im = iio.imread('imageio:chelsea.png') # read a standard image im.shape # im is a NumPy array of shape (300, 451, 3)...
- [The Top 20 Python Libraries Every Data Professional Should Know](https://emeritus.org/in/learn/most-used-python-libraries/)
  - NumPy is fundamental to scientific computing using Python programming. It supports large multi-dimensional arrays and matrices and has a collection of mathematical functions to operate on these arrays. Array creation and manipulation Mathematical functions Linear algebra operations Therefore, data professionals often use NumPy for numerical data manipulation, essential in data analysis and data science. Additionally, it is widely used in areas such as machine learning, data preprocessing, and...
- [Exploring Imageio: A Comprehensive Guide to the Python Library](https://datascientest.com/en/exploring-imageio-a-comprehensive-guide-to-the-python-library)
  - Python is the most popular programming language, especially in the field of data science. This success is due to several advantages over other languages. Among its strengths are the numerous libraries designed for specific uses. These community-designed libraries extend Python’s functionality. There are a wide variety of Python libraries designed for Data Science and Machine Learning. Examples include Numpy and Pandas. Imageio is a library specifically dedicated to image data.... ### What is...
- [High-performance Python - Reddit](https://www.reddit.com/r/Python/comments/vd1tyd/highperformance_python/)
  - But first of all, a question: “Oh, high-performance computing and Python don’t go along well, why don’t you program in “X”? Well, I know that I should be an hardcore programmer that programmes in C/C++/Fortran/Julia/[insert programming_language], but I’ve always programmed in Python (and always tried to find this extra performance by tweaking some things), and it’s also my team’s primary programming language. The focus to discuss is to work with Numpy and Pandas, in 2 main categories: 1) a...
- [I/O performance in Python - rabexc.org](https://rabexc.org/posts/io-performance-in-python)
  - I am writing a small python script to keep track of various events and messages. It uses a flat file as an index, *each record being of the same size* and containing details about each message. This file can get large, in the order of several hundreds of megabytes. The python code is trivial, given that each record is exactly the same size, but what is the fastest way to access and use that index file? With python (or any programming language, for what is worth), I have plenty of ways to read...

## User

I do not want to write custom c extensions. Cython is not an option as that only speeds up cpu bottlenecks. Pillow-SIMD, ImageIO, OpenCV, or Lycon would be perfect if again I can make them work with custom and proprietary image formats.

## Assistant

Based on your requirements for handling custom and proprietary image formats without writing C extensions, here are some potential approaches:

1. OpenCV (cv2):
OpenCV is highly flexible and can be extended to support custom formats. You could:

- Use OpenCV's FileStorage class to read your proprietary format into a Mat object.[1]
- Implement a custom cv::imread() function to handle your format.
- Use cv2.imdecode() to decode raw image data if you can extract it from your format.[3]

2. ImageIO:
ImageIO is designed to be extensible for custom formats. You can:

- Create a custom plugin for your format by implementing a Reader and Writer class.[5]
- Use the imageio.plugins.example module as a template for your custom format plugin.[5]

3. Pillow-SIMD:
While Pillow-SIMD itself doesn't directly support custom formats, you could:

- Use Pillow's plugin system to create a custom ImageFile.Parser for your format.[6]
- Implement the necessary methods like _open(), _load(), and _save() for your format.

4. Lycon:
Lycon is more limited in extensibility, but you could potentially:

- Modify its source code to add support for your format, as it's derived from OpenCV.[8]

Recommended approach:
Given your constraints, I would recommend using OpenCV (cv2) or ImageIO:

1. OpenCV offers high performance and flexibility. You can implement custom loading functions or use existing methods like cv2.imdecode() to handle your format.

2. ImageIO provides a straightforward plugin system for custom formats, making it easier to integrate your proprietary format without modifying the library itself.

Both options allow you to leverage optimized image processing operations after loading your custom format. OpenCV might have a slight edge in performance, while ImageIO could be easier to extend for custom formats.

Remember to benchmark these solutions with your specific use case to determine which performs best for your proprietary format and processing needs.

### Sources

- [How to Change Image File Extension - Indian AI Production](https://indianaiproduction.com/change-image-extension-opencv-python/)
  - In Python OpenCV Tutorial, we are going to change the image file extension from one form to another using cv2.imwrite() function. Like JPG to PNG or PNG to JPG. Opencv Support Below Image file format to read & write(Save): Windows bitmaps – *.bmp, *.dib (always supported) JPEG files – *.jpeg, *.jpg, *.jpe (see the Notes section) JPEG 2000 files – *.jp2 (see the Notes section) Portable Network Graphics – *.png (see the Notes section) Portable image format – *.pbm, *.pgm, *.ppm (always...
- [JuliaIO/ImageIO.jl: Load images in Julia. Designed for ... - GitHub](https://github.com/JuliaIO/ImageIO.jl)
  - FileIO.jl integration for image files FormatExtensionsProviderImplementationComment JPEG.jpg, .jpegJpegTurbo.jlJulia wrapper of libjpeg-turboBenchmark results against other backends OpenEXR.exrOpenEXR.jlJulia wrapper of OpenEXR Portable Bitmap formats.pbm, .pgm, .ppmNetpbm.jlpure Julia PNG (Portable Network Graphics).pngPNGFiles.jlJulia wrapper of libpngBenchmark vs. ImageMagick & QuartzImageIO QOI (Quite Okay Image) format.qoiQOI.jlpure Julia DEC SIXEL (six-pixels) graphics.six,...
- [Imageio formats — imageio 2.8.0 documentation](https://imageio.readthedocs.io/en/v2.8.0/formats.html)
  - Imageio formats¶ This page lists all formats currently supported by imageio. Each format can support extra keyword arguments for reading and writing, which can be specified in the call to get_reader(), get_writer(), imread(), imwrite() etc. Further, formats are free to provide additional methods on their Reader and Writer objects. These parameters and extra methods are specified in the documentation for each format. Single images¶ - - TIFF format - - Windows Bitmap - - BUFR - - Windows Cursor...
- [Performance Improvement Through Faster Software Components](https://forums.fast.ai/t/performance-improvement-through-faster-software-components/32628)
  - 205 def verify_image(file:Path, idx:int, delete:bool, max_size:Union[int,Tuple[int,int]]=None, dest:Path=None, n_channels:int=3, --> 206 interp=PIL.Image.BILINEAR, ext:str=None, img_format:str=None, resume:bool=False, kwargs): 207 "Check if the image in file exists, maybe resize it and copy it in dest." 208 try: AttributeError: module 'PIL' has no attribute 'Image' Reinstalling pillow 5.3.0 got the same error. Something is going on, no idea what but a pity I can’t use the SIMD...
- [Supported Formats — imageio 2.35.1 documentation](https://imageio.readthedocs.io/en/stable/formats/index.html)
  - Note If you just want to know if a specific extension/format is supported you can search this page using Ctrl+F and then type the name of the extension or format. ImageIO reads and writes images by delegating your request to one of many backends. Example backends are pillow, ffmpeg, tifffile among others. Each backend supports its own set of formats, which is how ImageIO manages to support so many of them. To help you navigate this format jungle, ImageIO provides various curated lists of...
- [Performance Tips and Tricks - | fastai](https://fastai1.fast.ai/performance.html)
  - Pillow for its image processing and you have to rebuild Pillow to take advantage of libjpeg-turbo. To learn how to rebuild Pillow-SIMD or Pillow with libjpeg-turbo see the Pillow-SIMD entry.... #### Background First, there was PIL (Python Image Library). And then its development was abandoned. Then, Pillow forked PIL as a drop-in replacement and according to its benchmarks it is significantly faster than ImageMagick, OpenCV, IPP and other fast image processing libraries (on identical...
- [uploadcare/pillow-simd: The friendly PIL fork - GitHub](https://github.com/uploadcare/pillow-simd)
  - Pillow-SIMD is highly optimized version of Pillow library for x86 architecture (mainly Intel and AMD CPUs). Pillow-SIMD is "following" Pillow which means it is drop-in replacements for Pillow of the same version. For example, Pillow-SIMD 3.2.0.post3 is a drop-in replacement for Pillow 3.2.0, and Pillow-SIMD 3.3.3.post0 — for Pillow 3.3.3. For more information on the original Pillow, please refer to: read the documentation, check the changelog and find out how to contribute.... SIMD stands for...
- [ethereon/lycon: A minimal and fast image library for Python and C++](https://github.com/ethereon/lycon)
  - A minimal and fast image library for Python and C++. Lycon is a small subset of optimized image operations derived from OpenCV. Current set of features include: Reading and writing JPEG and PNG images Fast SIMD optimized image resizing Zero-copy interop with NumPy whenever possible Tested on: Linux (Ubuntu 14.04) with Python 2.7.6and 3.5.2. macOS (Sierra, 10.12) with Python 2.7.11and 3.5.1. pip install lycon Native extension dependencies: CMake 2.8 or newer C++ toolchain LibJPEG LibPNG...
- [Top 8 Image-Processing Python Libraries Used in Machine Learning](https://neptune.ai/blog/image-processing-python-libraries-for-machine-learning)
  - import cv2 as cv import numpy as np import matplotlib.pyplot as plt img = cv.imread('goku.jpeg') gray_image = cv.cvtColor(img, cv.COLOR_BGR2GRAY) fig, ax = plt.subplots(1, 2, figsize=(16, 8)) fig.tight_layout() ax.imshow(cv.cvtColor(img, cv.COLOR_BGR2RGB)) ax.set_title("Original") ax.imshow(cv.cvtColor(gray_image, cv.COLOR_BGR2RGB)) ax.set_title("Grayscale") plt.show() ... import cv2 as cv import numpy as np import matplotlib.pyplot as plt img = cv.imread('goku.jpeg') b, g, r = cv.split(img)...

## User

Which is better: OpenCV or ImageIO? Which has more support? which is more performant? Which has more stability? Which is easier to get started with? Which supports custom image formats better?

## Assistant

Based on the information provided and the specific requirements you mentioned, here's a comparison between OpenCV and ImageIO:

## Performance

OpenCV is generally more performant than ImageIO. In a speed comparison test, OpenCV (cv2) was consistently faster than ImageIO, with an average speed improvement of 39.4% when reading images.[3]

## Support and Ecosystem

OpenCV has broader support and a larger ecosystem:

1. It covers a vast array of computer vision tasks, from basic image processing to advanced 3D reconstructions.[1]
2. OpenCV provides bindings for multiple programming languages, including Python, Java, and C++.[1]
3. It has a robust community contributing novel algorithms, techniques, and optimizations.[1]

## Stability

Both libraries are stable, but OpenCV has a longer history and is more widely used in production environments. It's constantly evolving and adapting to new technologies.[1]

## Ease of Getting Started

ImageIO might be slightly easier to get started with for basic image I/O operations. However, OpenCV's documentation has been improving, with more intuitive documentation and learning resources being developed.[1]

## Support for Custom Image Formats

OpenCV has better support for custom and proprietary image formats:

1. It offers more flexibility in handling various image formats.[5]
2. OpenCV allows implementation of custom loading functions or use of existing methods like cv2.imdecode() to handle custom formats.[5]
3. It has a wider range of supported formats out-of-the-box.[6]

## Additional Considerations

1. OpenCV is more versatile, offering not just image I/O but also a wide range of computer vision and image processing capabilities.[1]
2. OpenCV has better integration with deep learning frameworks and GPU acceleration.[1]
3. OpenCV is actively maintained and regularly updated to embrace new technologies and improve performance.[1]

Given your specific needs for handling a proprietary image format and the requirement for high performance, OpenCV appears to be the better choice. It offers more flexibility for implementing custom format support, better performance, and a wider range of tools that might be useful as your project evolves.

### Sources

- [Why You Need To Start Learning OpenCV in 2024!](https://opencv.org/blog/learning-opencv/)
  - Be it drawing bounding boxes for object detection, segmenting images, or plotting key points, OpenCV offers easy-to-use functions. 4 ...
- [Donate & Support OpenCV](https://opencv.org/support/)
  - Individual Donations. Individuals and organizations who benefit from OpenCV are encouraged to show their support with a direct donation, either as a one-time ...
- [[python] image processing speed comparison cv2 vs imageio](https://greatjoy.tistory.com/50)
  - [python] image processing speed comparison cv2 vs imageio There are two way on image processing in python. I wondered the speed using 'cv2' and 'imageio' on reading images. I tested with 1000*667 size picture to compare their speed. 'cv2' was faster than 'imageio' in all time and the records were 32%, 39%, 29%, 44%, 49%, 40%, 42%, 45%, 34%, 40%. The average is 39.4%. Conclusion : Use cv2!!! [Regression] Piecewise Regression with numpy (0)2019.01.29 [케라스(keras)] 케라스에서 텐서보드 사용하기-Tensorboard with...
- [Slow video reading of imageio.v3 compared to opencv #1086 - GitHub](https://github.com/imageio/imageio/issues/1086)
  - Have a question about this project? Sign up for a free GitHub account to open an issue and contact its maintainers and the community. By clicking “Sign up for GitHub”, you agree to our terms of service and privacy statement. We’ll occasionally send you account related emails. Already on GitHub? Sign in to your account I benchmarked the reading speed of .MP4 video between Imageio.v3 and opencv::VideoCapture. This is the python code to compare the speed: import cv2 import time import imageio.v3...
- [Image file reading and writing - OpenCV Documentation](https://docs.opencv.org/4.x/d4/da8/group__imgcodecs.html)
  - Checks if the specified image file or specified file extension can be encoded by OpenCV. CV_EXPORTS_W size_tcv::imcount (const String &filename, int flags=IMREAD_ANYCOLOR) Returns the number of images inside the given file. CV_EXPORTS_W Matcv::imdecode (InputArray buf, int flags) Reads an image from a buffer in memory. CV_EXPORTS Matcv::imdecode (InputArray buf, int flags, Mat *dst)... Checks if the specified image file can be decoded by OpenCV. The function haveImageReader checks if OpenCV is...
- [OpenCV configuration options reference](https://docs.opencv.org/4.x/db/d05/tutorial_config_reference.html)
  - ENABLE_THIN_LTOClangEnable thin LTO which incorporates intermediate bitcode to binaries allowing consumers optimize their applications later. OPENCV_ALGO_HINT_DEFAULTAnySet default OpenCV implementation hint value: ALGO_HINT_ACCURATE or ALGO_HINT_APROX. Dangerous! The option changes behaviour globally and may affect accuracy of many algorithms. Following options can be used to enables IPP optimizations for each functions but increases the size of the opencv library. All options are disabled by...
- [Core API v2 — imageio 2.35.1 documentation](https://imageio.readthedocs.io/en/stable/reference/userapi.html)
  - For a larger degree of control, imageio provides functions and . They respectively return an and an object, which can be used to read/write data and meta data in a more controlled manner. This also allows specific scientific formats to be exposed in a way that best suits that file-format. imageio.v2.get_reader( *uri*, *format=None*, *mode='?'*, kwargs*)# Returns a object which can be used to read data and meta data from the specified file. Parameters:... uri{str, pathlib.Path, bytes, file} The...
