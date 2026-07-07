---
source_url: "https://www.perplexity.ai/search/8b5b82c4-6776-483b-ba70-6b8ba02ccc30"
thread_uuid: "86f2f9e9-85e2-483f-a812-119471161e93"
slug: "8b5b82c4-6776-483b-ba70-6b8ba02ccc30"
title: "```
    def rotate90(self, times: int) -> None:
        \"\"\"Rotate all mipmaps in 90° steps, clock-wise for positive times, counter-clockwise for negative times.\"\"\"
        if not self.mipmaps or self._format is TPCTextureFormat.Invalid:
            raise ValueError(\"Invalid texture format or no mipmaps\")

        times = times % 4  # Normalize to 0-3 range
        if times == 0:
            return  # No rotation needed

        is_dxt = self._format in (TPCTextureFormat.DXT1, TPCTextureFormat.DXT5)
        bytes_per_block: Literal[1, 8, 16] = self._format.bytes_per_block()  # 1 for uncompressed (RGB, RGBA, etc).
        block_size: Literal[1, 4] = self._format.block_size()  # 1 for uncompressed (RGB, RGBA, etc) and 4 for DXT.
        bytes_per_pixel: Literal[1, 4, 3, 0] = self._format.bytes_per_pixel()  # 1 for compressed (DXT1, DXT5).

        for mipmap in self.mipmaps:
            width, height = mipmap.width, mipmap.height
            if width <= 0 or height <= 0:
                continue

            # Ensure dimensions are multiples of 4 for DXT formats
            if is_dxt:
                width = (width + 3) // 4 * 4
                height = (height + 3) // 4 * 4

            # remaining implementation...
            new_data = bytearray(len(mipmap.data))

            if is_dxt:
                blocks_per_row = width // 4
                blocks_per_col = height // 4

                for y in range(blocks_per_col):
                    for x in range(blocks_per_row):
                        src_block_index = y * blocks_per_row + x
                        src_offset = src_block_index * bytes_per_block

                        if times == 1:  # 90 degrees clockwise
                            dst_block_index = x * blocks_per_col + (blocks_per_col - 1 - y)
                        elif times == 2:  # 180 degrees  # noqa: PLR2004
                            dst_block_index = (blocks_per_col - 1 - y) * blocks_per_row + (blocks_per_row - 1 - x)
                        else:  # 270 degrees clockwise (90 degrees counter-clockwise)
                            dst_block_index = (blocks_per_row - 1 - x) * blocks_per_col + y

                        dst_offset = dst_block_index * bytes_per_block
                        new_data[dst_offset:dst_offset + bytes_per_block] = mipmap.data[src_offset:src_offset + bytes_per_block]

            else:  # Uncompressed formats
                for y in range(height):
                    for x in range(width):
                        src_offset = (y * width + x) * bytes_per_pixel

                        if times == 1:  # 90 degrees clockwise
                            dst_offset = (x * height + (height - 1 - y)) * bytes_per_pixel
                        elif times == 2:  # 180 degrees  # noqa: PLR2004
                            dst_offset = ((height - 1 - y) * width + (width - 1 - x)) * bytes_per_pixel
                        else:  # 270 degrees clockwise (90 degrees counter-clockwise)
                            dst_offset = ((width - 1 - x) * height + y) * bytes_per_pixel

                        new_data[dst_offset:dst_offset + bytes_per_pixel] = mipmap.data[src_offset:src_offset + bytes_per_pixel]

            mipmap.data = new_data

            # Update mipmap dimensions
            if times % 2 != 0:
                mipmap.width, mipmap.height = mipmap.height, mipmap.width
```

Determine if this is the correct way to rotate DXT1, DXT5 (block compressed) mipmap data vs uncompressed (RGB/RGBA) data."
extracted_at: "2026-06-29T12:53:35.559Z"
matched_keywords: ["redundancy"]
entry_count: 2
provenance: perplexity-rest-api
---

# ```
    def rotate90(self, times: int) -> None:
        """Rotate all mipmaps in 90° steps, clock-wise for positive times, counter-clockwise for negative times."""
        if not self.mipmaps or self._format is TPCTextureFormat.Invalid:
            raise ValueError("Invalid texture format or no mipmaps")

        times = times % 4  # Normalize to 0-3 range
        if times == 0:
            return  # No rotation needed

        is_dxt = self._format in (TPCTextureFormat.DXT1, TPCTextureFormat.DXT5)
        bytes_per_block: Literal[1, 8, 16] = self._format.bytes_per_block()  # 1 for uncompressed (RGB, RGBA, etc).
        block_size: Literal[1, 4] = self._format.block_size()  # 1 for uncompressed (RGB, RGBA, etc) and 4 for DXT.
        bytes_per_pixel: Literal[1, 4, 3, 0] = self._format.bytes_per_pixel()  # 1 for compressed (DXT1, DXT5).

        for mipmap in self.mipmaps:
            width, height = mipmap.width, mipmap.height
            if width <= 0 or height <= 0:
                continue

            # Ensure dimensions are multiples of 4 for DXT formats
            if is_dxt:
                width = (width + 3) // 4 * 4
                height = (height + 3) // 4 * 4

            # remaining implementation...
            new_data = bytearray(len(mipmap.data))

            if is_dxt:
                blocks_per_row = width // 4
                blocks_per_col = height // 4

                for y in range(blocks_per_col):
                    for x in range(blocks_per_row):
                        src_block_index = y * blocks_per_row + x
                        src_offset = src_block_index * bytes_per_block

                        if times == 1:  # 90 degrees clockwise
                            dst_block_index = x * blocks_per_col + (blocks_per_col - 1 - y)
                        elif times == 2:  # 180 degrees  # noqa: PLR2004
                            dst_block_index = (blocks_per_col - 1 - y) * blocks_per_row + (blocks_per_row - 1 - x)
                        else:  # 270 degrees clockwise (90 degrees counter-clockwise)
                            dst_block_index = (blocks_per_row - 1 - x) * blocks_per_col + y

                        dst_offset = dst_block_index * bytes_per_block
                        new_data[dst_offset:dst_offset + bytes_per_block] = mipmap.data[src_offset:src_offset + bytes_per_block]

            else:  # Uncompressed formats
                for y in range(height):
                    for x in range(width):
                        src_offset = (y * width + x) * bytes_per_pixel

                        if times == 1:  # 90 degrees clockwise
                            dst_offset = (x * height + (height - 1 - y)) * bytes_per_pixel
                        elif times == 2:  # 180 degrees  # noqa: PLR2004
                            dst_offset = ((height - 1 - y) * width + (width - 1 - x)) * bytes_per_pixel
                        else:  # 270 degrees clockwise (90 degrees counter-clockwise)
                            dst_offset = ((width - 1 - x) * height + y) * bytes_per_pixel

                        new_data[dst_offset:dst_offset + bytes_per_pixel] = mipmap.data[src_offset:src_offset + bytes_per_pixel]

            mipmap.data = new_data

            # Update mipmap dimensions
            if times % 2 != 0:
                mipmap.width, mipmap.height = mipmap.height, mipmap.width
```

Determine if this is the correct way to rotate DXT1, DXT5 (block compressed) mipmap data vs uncompressed (RGB/RGBA) data.

Source: [Perplexity thread](https://www.perplexity.ai/search/8b5b82c4-6776-483b-ba70-6b8ba02ccc30)

## User

```
    def rotate90(self, times: int) -> None:
        """Rotate all mipmaps in 90° steps, clock-wise for positive times, counter-clockwise for negative times."""
        if not self.mipmaps or self._format is TPCTextureFormat.Invalid:
            raise ValueError("Invalid texture format or no mipmaps")

        times = times % 4  # Normalize to 0-3 range
        if times == 0:
            return  # No rotation needed

        is_dxt = self._format in (TPCTextureFormat.DXT1, TPCTextureFormat.DXT5)
        bytes_per_block: Literal[1, 8, 16] = self._format.bytes_per_block()  # 1 for uncompressed (RGB, RGBA, etc).
        block_size: Literal[1, 4] = self._format.block_size()  # 1 for uncompressed (RGB, RGBA, etc) and 4 for DXT.
        bytes_per_pixel: Literal[1, 4, 3, 0] = self._format.bytes_per_pixel()  # 1 for compressed (DXT1, DXT5).

        for mipmap in self.mipmaps:
            width, height = mipmap.width, mipmap.height
            if width <= 0 or height <= 0:
                continue

            # Ensure dimensions are multiples of 4 for DXT formats
            if is_dxt:
                width = (width + 3) // 4 * 4
                height = (height + 3) // 4 * 4

            # remaining implementation...
            new_data = bytearray(len(mipmap.data))

            if is_dxt:
                blocks_per_row = width // 4
                blocks_per_col = height // 4

                for y in range(blocks_per_col):
                    for x in range(blocks_per_row):
                        src_block_index = y * blocks_per_row + x
                        src_offset = src_block_index * bytes_per_block

                        if times == 1:  # 90 degrees clockwise
                            dst_block_index = x * blocks_per_col + (blocks_per_col - 1 - y)
                        elif times == 2:  # 180 degrees  # noqa: PLR2004
                            dst_block_index = (blocks_per_col - 1 - y) * blocks_per_row + (blocks_per_row - 1 - x)
                        else:  # 270 degrees clockwise (90 degrees counter-clockwise)
                            dst_block_index = (blocks_per_row - 1 - x) * blocks_per_col + y

                        dst_offset = dst_block_index * bytes_per_block
                        new_data[dst_offset:dst_offset + bytes_per_block] = mipmap.data[src_offset:src_offset + bytes_per_block]

            else:  # Uncompressed formats
                for y in range(height):
                    for x in range(width):
                        src_offset = (y * width + x) * bytes_per_pixel

                        if times == 1:  # 90 degrees clockwise
                            dst_offset = (x * height + (height - 1 - y)) * bytes_per_pixel
                        elif times == 2:  # 180 degrees  # noqa: PLR2004
                            dst_offset = ((height - 1 - y) * width + (width - 1 - x)) * bytes_per_pixel
                        else:  # 270 degrees clockwise (90 degrees counter-clockwise)
                            dst_offset = ((width - 1 - x) * height + y) * bytes_per_pixel

                        new_data[dst_offset:dst_offset + bytes_per_pixel] = mipmap.data[src_offset:src_offset + bytes_per_pixel]

            mipmap.data = new_data

            # Update mipmap dimensions
            if times % 2 != 0:
                mipmap.width, mipmap.height = mipmap.height, mipmap.width
```

Determine if this is the correct way to rotate DXT1, DXT5 (block compressed) mipmap data vs uncompressed (RGB/RGBA) data.

## Assistant

The provided `rotate90` method effectively handles the rotation of mipmaps for both block-compressed formats (DXT1, DXT5) and uncompressed formats (RGB, RGBA). Here's a detailed analysis of its correctness:

## Handling Block-Compressed Formats (DXT1, DXT5)

**Block Alignment:**
- The method ensures that the width and height are multiples of 4, which is necessary for DXT1 and DXT5 formats since they operate on 4x4 pixel blocks.[1]

**Block Rotation Logic:**
- The rotation logic correctly maps each source block to its corresponding destination block based on the rotation degree (`times`).
- For **90 degrees clockwise**, the destination block index is calculated as `x * blocks_per_col + (blocks_per_col - 1 - y)`.
- For **180 degrees**, it becomes `(blocks_per_col - 1 - y) * blocks_per_row + (blocks_per_row - 1 - x)`.
- For **270 degrees clockwise (or 90 degrees counter-clockwise)**, it is `(blocks_per_row - 1 - x) * blocks_per_col + y`.
  
These mappings ensure that each 4x4 block is correctly repositioned without altering the compressed data integrity.[2]

**Byte Handling:**
- The method correctly processes the compressed data by handling `bytes_per_block` based on the format. DXT1 uses 8 bytes per block, while DXT5 uses 16 bytes per block.[3]

## Handling Uncompressed Formats (RGB, RGBA)

**Pixel Rotation Logic:**
- For uncompressed formats, the method processes each pixel individually.
- The destination offset calculations for each rotation degree ensure that pixels are correctly repositioned:
  - **90 degrees clockwise:** `(x * height + (height - 1 - y)) * bytes_per_pixel`
  - **180 degrees:** `((height - 1 - y) * width + (width - 1 - x)) * bytes_per_pixel`
  - **270 degrees clockwise (or 90 degrees counter-clockwise):** `((width - 1 - x) * height + y) * bytes_per_pixel`
  
This approach maintains the correct pixel order post-rotation.[4]

**Dimension Swapping:**
- The method swaps the `width` and `height` of the mipmap only when the rotation degree results in a non-square texture (i.e., 90 or 270 degrees). This is essential for maintaining correct texture dimensions after rotation.[5]

## Conclusion

The `rotate90` method correctly distinguishes between block-compressed and uncompressed formats, applying appropriate rotation techniques for each. It ensures data integrity for DXT1 and DXT5 formats by handling block-based data appropriately and accurately rotates uncompressed pixel data. The normalization of rotation steps and dimension adjustments further validate the method's robustness.







## User

Is it at all possible to unify the code blocks so that a conditional `is_dxt` does not need to be determined?

## Assistant

Yes, it is possible to unify the code blocks for rotating both block-compressed (DXT1, DXT5) and uncompressed (RGB, RGBA) mipmap formats, thereby eliminating the need for a conditional `is_dxt`. This can be achieved by abstracting the rotation logic to operate on generalized data units, whether they are blocks or pixels. Below is a comprehensive approach to achieve this unification:

## Unified Rotation Approach

### **Abstract Data Units**

- **Define a Rotation Unit:**
  - For block-compressed formats (DXT1, DXT5), the unit is a **block** (typically 4x4 pixels).
  - For uncompressed formats (RGB, RGBA), the unit is a **pixel**.

- **Determine Unit Size Dynamically:**
  - Assign `unit_width` and `unit_height` based on the format.
    - **DXT Formats:** `unit_width = 4`, `unit_height = 4`
    - **Uncompressed Formats:** `unit_width = 1`, `unit_height = 1`

### **Simplified Rotation Logic**

1. **Normalize Rotation Steps:**
   ```python
   times = times % 4  # Normalize to 0-3 range
   if times == 0:
       return  # No rotation needed
   ```

2. **Determine Rotation Parameters:**
   ```python
   unit_width = 4 if self._format in (TPCTextureFormat.DXT1, TPCTextureFormat.DXT5) else 1
   unit_height = 4 if self._format in (TPCTextureFormat.DXT1, TPCTextureFormat.DXT5) else 1
   bytes_per_unit = self._format.bytes_per_block() if unit_width > 1 else self._format.bytes_per_pixel()
   ```

3. **Iterate Over Units:**
   ```python
   for mipmap in self.mipmaps:
       width, height = mipmap.width, mipmap.height
       if width <= 0 or height <= 0:
           continue

       # Adjust dimensions for block formats
       width = (width + unit_width - 1) // unit_width * unit_width
       height = (height + unit_height - 1) // unit_height * unit_height

       new_data = bytearray(len(mipmap.data))
       units_per_row = width // unit_width
       units_per_col = height // unit_height

       for y in range(units_per_col):
           for x in range(units_per_row):
               src_index = y * units_per_row + x
               src_offset = src_index * bytes_per_unit

               if times == 1:  # 90 degrees clockwise
                   dst_index = x * units_per_col + (units_per_col - 1 - y)
               elif times == 2:  # 180 degrees
                   dst_index = (units_per_col - 1 - y) * units_per_row + (units_per_row - 1 - x)
               else:  # 270 degrees clockwise (90 degrees counter-clockwise)
                   dst_index = (units_per_row - 1 - x) * units_per_col + y

               dst_offset = dst_index * bytes_per_unit
               new_data[dst_offset:dst_offset + bytes_per_unit] = mipmap.data[src_offset:src_offset + bytes_per_unit]

       mipmap.data = new_data

       # Update mipmap dimensions if rotation is 90 or 270 degrees
       if times % 2 != 0:
           mipmap.width, mipmap.height = mipmap.height, mipmap.width
   ```

### **Benefits of This Approach**

- **Eliminates Conditionals:**
  - By abstracting the unit size and processing, the same rotation logic applies to both compressed and uncompressed formats without explicit conditionals.

- **Scalability:**
  - The method can easily accommodate additional formats by adjusting the `unit_width`, `unit_height`, and `bytes_per_unit` accordingly.

- **Maintainability:**
  - A unified codebase reduces redundancy and simplifies maintenance, as changes to the rotation logic need to be made in only one place.

### **Considerations**

- **Performance:**
  - While unifying the code enhances readability and maintainability, it's essential to ensure that the abstraction does not introduce significant performance overhead, especially for large textures.

- **Data Integrity:**
  - Ensure that the abstraction correctly handles the specific requirements of each format, such as block alignment for DXT formats and byte ordering for uncompressed formats.

## Conclusion

By abstracting the rotation logic to operate on generalized units, it is feasible to unify the handling of both block-compressed and uncompressed mipmap formats. This eliminates the need for conditional checks like `is_dxt` and results in cleaner, more maintainable code. However, it's crucial to carefully manage the specific requirements of each format within the abstraction to maintain data integrity and performance.

### Sources

- [Can DXT1 DXT5 formats and RGB RGBA formats share the same rotation logic in Python? - Wolfram|Alpha](https://www.wolframalpha.com/input?input=Can+DXT1+DXT5+formats+and+RGB+RGBA+formats+share+the+same+rotation+logic+in+Python%3F)
- [Ways to unify DXT and RGB rotation in texture processing - Wolfram|Alpha](https://www.wolframalpha.com/input?input=Ways+to+unify+DXT+and+RGB+rotation+in+texture+processing)
- [Is it possible to handle DXT1 DXT5 and uncompressed formats with one code block in Python? - Wolfram|Alpha](https://www.wolframalpha.com/input?input=Is+it+possible+to+handle+DXT1+DXT5+and+uncompressed+formats+with+one+code+block+in+Python%3F)
- [Pros and cons of unifying DXT and RGBA rotation methods - Wolfram|Alpha](https://www.wolframalpha.com/input?input=Pros+and+cons+of+unifying+DXT+and+RGBA+rotation+methods)
- [What are some techniques for simplifying texture rotation in coding? - Wolfram|Alpha](https://www.wolframalpha.com/input?input=What+are+some+techniques+for+simplifying+texture+rotation+in+coding%3F)
- [Can you integrate block and pixel rotation for textures in one method? - Wolfram|Alpha](https://www.wolframalpha.com/input?input=Can+you+integrate+block+and+pixel+rotation+for+textures+in+one+method%3F)
- [How to handle 2D array rotations without isolating data formats? - Wolfram|Alpha](https://www.wolframalpha.com/input?input=How+to+handle+2D+array+rotations+without+isolating+data+formats%3F)
