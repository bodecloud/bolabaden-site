---
source_url: "https://www.perplexity.ai/search/b5d86390-4782-4d24-a346-df2d40ae961e"
thread_uuid: "2c165ece-bb6d-4f8b-98b2-51afef3e8399"
slug: "b5d86390-4782-4d24-a346-df2d40ae961e"
title: "a detailed Texture class for ModernGL"
extracted_at: "2026-06-29T16:08:58.717Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# a detailed Texture class for ModernGL

Source: [Perplexity thread](https://www.perplexity.ai/search/b5d86390-4782-4d24-a346-df2d40ae961e)

## User

a detailed Texture class for ModernGL

## Assistant

The `Texture` class in ModernGL is a powerful abstraction for managing OpenGL textures. Textures in ModernGL are OpenGL objects that store one or more images with the same format, and they can be used as a source for texture access in shaders or as render targets.

## **Creating Textures**

Textures cannot be instantiated directly; they are created through a ModernGL context using methods like `context.texture()` or `context.depth_texture()`. 

### **Key Parameters for Texture Creation**
- **`size` (tuple):** Specifies the width and height of the texture.
- **`components` (int):** Number of components per pixel (e.g., 1 for grayscale, 3 for RGB, 4 for RGBA).
- **`data` (bytes, optional):** Initial content of the texture.
- **`samples` (int, optional):** Number of samples for multisampling. Default is 0 (no multisampling).
- **`alignment` (int, optional):** Byte alignment of rows in the texture. Default is 1.
- **`dtype` (str, optional):** Data type of the texture (e.g., `'f1'`, `'f4'`, etc.).
- **`internal_format` (int, optional):** Overrides the internal format of the texture if needed.

For depth textures, use `context.depth_texture()` with similar parameters.

## **Methods**

### **Binding and Usage**
- **`use(location=0)`**: Binds the texture to a specified texture unit. This is essential for shaders to access the texture.
  - Example:
    ```python
    program['texture_unit'] = 0
    my_texture.use(location=0)
    ```
  
### **Reading Data**
- **`read(level=0, alignment=1)`**: Reads pixel data from the texture into system memory as bytes.
- **`read_into(buffer, level=0, alignment=1, write_offset=0)`**: Reads data directly into a buffer object.

### **Releasing Resources**
- **`release()`**: Releases the GPU resources associated with the texture.

## **Attributes**

### **Texture Properties**
- **Dimensions and Format:**
  - `width`, `height`: Dimensions of the texture.
  - `size`: Tuple representing `(width, height)`.
  - `components`: Number of components per pixel.
  - `dtype`: Data type of the texture.
  - `samples`: Number of samples for multisampling.
  
- **Swizzle Mask (`swizzle`)**: Controls how components are reordered when accessed in shaders. For example:
  ```python
  texture.swizzle = 'RGB1'  # Alpha channel always returns 1.0
  ```

### **Filtering and Wrapping**
- **Filtering (`filter`)**: Specifies minification and magnification filters. Example:
  ```python
  texture.filter = (moderngl.NEAREST, moderngl.LINEAR)
  ```
  
- **Wrapping (`repeat_x`, `repeat_y`)**: Controls whether textures repeat or clamp to edges. Example:
  ```python
  texture.repeat_x = True   # Enable repeat
  texture.repeat_y = False  # Disable repeat
  ```

### **Other Attributes**
- `depth`: Indicates if it's a depth texture.
- `anisotropy`: Specifies anisotropic filtering level.
- `compare_func`: Sets comparison functions for depth textures.
- `ctx`: The ModernGL context to which this texture belongs.
- `glo`: Internal OpenGL object ID for debugging purposes.

## **Usage Example**

Here’s an example of creating and using a texture in ModernGL:
```python
import moderngl

# Create a context
ctx = moderngl.create_standalone_context()

# Create a texture with size (256x256), RGB format
texture = ctx.texture(size=(256, 256), components=3)

# Set filtering and wrapping options
texture.filter = (moderngl.LINEAR, moderngl.LINEAR)
texture.repeat_x = True
texture.repeat_y = False

# Bind to a shader's sampler uniform at location 0
program['my_texture'] = 0
texture.use(location=0)

# Release resources when done
texture.release()
```

This detailed functionality makes ModernGL's `Texture` class versatile for rendering tasks such as applying image data to meshes or using textures as framebuffers.

### Sources

- [Texture — ModernGL 5.6.4 documentation - Read the Docs](https://moderngl.readthedocs.io/en/5.6.4/reference/texture.html)
- [moderngl-window/examples/advanced/fragment_picking.py at master](https://github.com/moderngl/moderngl-window/blob/master/examples/advanced/fragment_picking.py)
  - A cross platform utility library for ModernGL making window creation and resource loading simple - moderngl/moderngl-window
- [Texture - ModernGL 5.12.0 documentation](https://moderngl.readthedocs.io/en/latest/reference/texture.html)
- [Texture - ModernGL 5.7.4 documentation](https://moderngl.readthedocs.io/en/5.7.4/reference/texture.html)
