---
source_url: "https://grok.com/c/1aa3d51f-d183-4c8a-b6a7-a5d2e24a6cb4"
conversation_id: "1aa3d51f-d183-4c8a-b6a7-a5d2e24a6cb4"
title: "TPC File Editing Module Overview"
extracted_at: "2026-06-29T16:33:10.003Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# TPC File Editing Module Overview

Source: [Grok conversation](https://grok.com/c/1aa3d51f-d183-4c8a-b6a7-a5d2e24a6cb4)

## User

_Time: 2025-11-08T13:57:02.103Z_

```python
"""This module handles classes relating to editing TPC files."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import IntEnum, auto
from typing import TYPE_CHECKING

from loggerplus import RobustLogger
from pykotor.common.stream import BinaryReader
from pykotor.resource.formats._base import ComparableMixin
from pykotor.resource.formats.tpc.convert.bgra import (
    bgr_to_bgra,
    bgr_to_grey,
    bgr_to_rgb,
    bgr_to_rgba,
    bgra_to_bgr,
    bgra_to_grey,
    bgra_to_rgb,
    bgra_to_rgba,
    rgb_to_bgr,
    rgb_to_bgra,
    rgba_to_bgra,
)
from pykotor.resource.formats.tpc.convert.dxt.compress_dxt import rgb_to_dxt1, rgba_to_dxt3, rgba_to_dxt5
from pykotor.resource.formats.tpc.convert.dxt.decompress_dxt import dxt1_to_rgb, dxt3_to_rgba, dxt5_to_rgba
from pykotor.resource.formats.tpc.convert.rgb import grey_to_rgb, grey_to_rgba, rgb_to_grey, rgb_to_rgba, rgba_to_grey, rgba_to_rgb
from pykotor.resource.formats.tpc.manipulate.downsample import downsample_dxt, downsample_rgb
from pykotor.resource.formats.tpc.manipulate.dxt_manipulate import flip_horizontally_dxt, flip_vertically_dxt, rotate_dxt1, rotate_dxt5
from pykotor.resource.formats.tpc.manipulate.rotate import flip_horizontally_rgb_rgba, flip_vertically_rgb_rgba, rotate_rgb_rgba
from pykotor.resource.formats.txi.txi_data import TXI
from pykotor.resource.type import ResourceType

if TYPE_CHECKING:
    from PIL import Image
    from qtpy.QtGui import QIcon, QImage, QPixmap
    from typing_extensions import Literal, Self  # pyright: ignore[reportMissingModuleSource]


class TPCTextureFormat(IntEnum):
    """Enumeration of supported TPC texture formats."""

    Invalid = -1
    Greyscale = 0
    DXT1 = auto()
    DXT3 = auto()
    DXT5 = auto()
    RGB = auto()
    RGBA = auto()
    BGRA = auto()
    BGR = auto()

    def block_size(self) -> Literal[1, 4]:
        """Get the block size for this format."""
        return 4 if self.is_dxt() else 1

<<<<<<< HEAD
    def bytes_per_pixel(self) -> Literal[1, 4, 3, 0]:
        """Get the number of bytes per pixel for this format."""
=======
    BINARY_TYPE = ResourceType.TPC
    COMPARABLE_FIELDS = ("_texture_format", "_width", "_height", "txi", "original_datatype_code")
    COMPARABLE_SEQUENCE_FIELDS = ("_mipmaps",)

    def __init__(
        self,
    ):
        self._texture_format: TPCTextureFormat = TPCTextureFormat.RGB
        self._mipmaps: list[bytes] = [bytes(0 for _ in range(4 * 4 * 3))]
        self._width: int = 4
        self._height: int = 4
        self.txi: str = ""
        from pykotor.resource.formats.tpc.io_tga import _DataTypes  # Prevent circular imports  # noqa: PLC0415

        self.original_datatype_code: _DataTypes = _DataTypes.NO_IMAGE_DATA

        # TODO(NickHugi): cube maps

    def __eq__(self, other):
        if not isinstance(other, TPC):
            return NotImplemented
        return (
            self._texture_format == other._texture_format
            and self._mipmaps == other._mipmaps
            and self._width == other._width
            and self._height == other._height
            and self.txi == other.txi
            and self.original_datatype_code == other.original_datatype_code
        )

    def __hash__(self):
        return hash((
            self._texture_format,
            tuple(self._mipmaps),
            self._width,
            self._height,
            self.txi,
            self.original_datatype_code
        ))

    def mipmap_count(
        self,
    ) -> int:
        """Returns the number of mipmaps.

        Returns:
        -------
            The number of mipmaps.
        """
        return len(self._mipmaps)

    def format(
        self,
    ) -> TPCTextureFormat:
        """Returns the format of the stored texture.

        Returns:
        -------
            The format of the stored texture.
        """
        return self._texture_format

    def dimensions(
        self,
    ) -> tuple[int, int]:
        """Returns the width and height of the largest mipmap.

        Returns:
        -------
            A tuple containing [width, height].
        """
        return self._width, self._height

    def get(
        self,
        mipmap: int = 0,
    ) -> TPCGetResult:
        """Returns a tuple containing the width, height, texture format, and data of the specified mipmap.

        Args:
        ----
            mipmap: The index of the mipmap.

        Returns:
        -------
            A tuple equal to (width, height, texture format, data).
        """
        width, height = self._mipmap_size(mipmap)
        return TPCGetResult(width, height, self._texture_format, self._mipmaps[mipmap])

    def convert(
        self,
        convert_format: TPCTextureFormat,
        mipmap: int = 0,
        y_flip: bool | None = None,  # noqa: FBT001
    ) -> TPCConvertResult:
        """Returns a tuple containing the width, height and data of the specified mipmap where the data returned is in the texture format specified.

        Args:
        ----
            convert_format: The format the texture data should be converted to.
            mipmap: The index of the mipmap.

        Returns:
        -------
            A tuple equal to (width, height, data)
        """
        width, height = self._mipmap_size(mipmap)
        raw_data: bytes = self._mipmaps[mipmap]
        if self._texture_format == convert_format and not y_flip:  # Is conversion needed?
            return TPCConvertResult(width, height, bytearray(raw_data))

        if y_flip:
            bytes_per_pixel = 0
            if self._texture_format == TPCTextureFormat.Greyscale:
                bytes_per_pixel = 1
            elif self._texture_format in {TPCTextureFormat.RGB, TPCTextureFormat.RGBA}:
                bytes_per_pixel = 4 if self._texture_format == TPCTextureFormat.RGBA else 3
            # If the image needs to be flipped and it's an uncompressed format
            if bytes_per_pixel > 0:
                raw_data = self.flip_image_data(raw_data, width, height, bytes_per_pixel)
                y_flip = False

        data: bytearray = bytearray(raw_data)
        if convert_format == TPCTextureFormat.Greyscale:
            if self._texture_format == TPCTextureFormat.DXT5:
                rgba_data = TPC._dxt5_to_rgba(raw_data, width, height)
                data = TPC._rgba_to_grey(bytes(rgba_data), width, height)
            elif self._texture_format == TPCTextureFormat.DXT1:
                rgba_data = TPC._dxt1_to_rgba(raw_data, width, height)
                data = TPC._rgba_to_grey(bytes(rgba_data), width, height)
            elif self._texture_format == TPCTextureFormat.RGBA:
                data = TPC._rgba_to_grey(raw_data, width, height)
            elif self._texture_format == TPCTextureFormat.RGB:
                rgba_data = TPC._rgb_to_rgba(raw_data, width, height)
                data = TPC._rgba_to_grey(bytes(rgba_data), width, height)

        if convert_format == TPCTextureFormat.RGBA:
            if self._texture_format == TPCTextureFormat.DXT5:
                data = TPC._dxt5_to_rgba(raw_data, width, height)
            elif self._texture_format == TPCTextureFormat.DXT1:
                data = TPC._dxt1_to_rgba(raw_data, width, height)
            elif self._texture_format == TPCTextureFormat.RGB:
                data = TPC._rgb_to_rgba(raw_data, width, height)
            elif self._texture_format == TPCTextureFormat.Greyscale:
                data = TPC._grey_to_rgba(raw_data, width, height)

        if convert_format == TPCTextureFormat.RGB:
            if self._texture_format == TPCTextureFormat.DXT5:
                data = TPC._dxt5_to_rgb(raw_data, width, height)
            elif self._texture_format == TPCTextureFormat.DXT1:
                data = TPC._dxt1_to_rgb(raw_data, width, height)
            elif self._texture_format == TPCTextureFormat.RGBA:
                data = TPC._rgba_to_rgb(raw_data, width, height)
            elif self._texture_format == TPCTextureFormat.Greyscale:
                rgba_data = TPC._grey_to_rgba(raw_data, width, height)
                data = TPC._rgba_to_rgb(bytes(rgba_data), width, height)

        return TPCConvertResult(width, height, data)

    def get_bytes_per_pixel(self):
>>>>>>> upstream-master
        bytes_per_pixel = 0
        if self is self.__class__.Greyscale:
            bytes_per_pixel = 1
        elif self.is_dxt():
            bytes_per_pixel = 1  # technically incorrect.
        elif self in (self.__class__.RGB, self.__class__.BGR):
            bytes_per_pixel = 3
        elif self in (self.__class__.RGBA, self.__class__.BGRA):
            bytes_per_pixel = 4
        return bytes_per_pixel

    def is_dxt(self) -> bool:
        """Check if this format is a DXT compression format."""
        return self in (
            self.__class__.DXT1,
            self.__class__.DXT3,
            self.__class__.DXT5,
        )

    def min_size(self) -> Literal[0, 1, 3, 4, 8, 16]:
        """Get the minimum size in bytes for this format."""
        min_size: int = 0
        if self is self.__class__.Greyscale:
            min_size = 1
        elif self in (self.__class__.RGB, self.__class__.BGR):
            min_size = 3
        elif self in (self.__class__.RGBA, self.__class__.BGRA):
            min_size = 4
        elif self.is_dxt():
            min_size = self.bytes_per_block()
        return min_size

    def get_size(self, width: int, height: int) -> int:
        """Calculate the size in bytes needed for an image of the given dimensions."""
        size: int = 0
        if self.is_dxt():
            bytes_per_block = self.bytes_per_block()
            size = ((width + 3) // 4) * ((height + 3) // 4) * bytes_per_block
        else:
            size = width * height * self.bytes_per_pixel()
        return max(self.min_size(), size)

    def to_qimage_format(self) -> QImage.Format:
        """Convert to Qt image format."""
        from qtpy.QtGui import QImage

        q_format = QImage.Format.Format_Invalid
        if self is self.__class__.Greyscale:
            q_format = QImage.Format.Format_Grayscale8
        elif self is self.__class__.RGB:
            q_format = QImage.Format.Format_RGB888
        elif self is self.__class__.BGR:
            q_format = QImage.Format.Format_BGR888
        elif self is self.__class__.RGBA:
            q_format = QImage.Format.Format_RGBA8888
        elif self is self.__class__.BGRA:
            q_format = QImage.Format.Format_ARGB32
        else:
            raise ValueError(f"Unsupported format: {self!r}")
        return q_format

    @classmethod
    def from_qimage_format(cls, qimage_format: QImage.Format) -> Self:
        """Create from Qt image format."""
        from qtpy.QtGui import QImage

        fmt = cls.Invalid
        if qimage_format == QImage.Format.Format_Grayscale8:
            fmt = cls.Greyscale
        if qimage_format == QImage.Format.Format_RGB888:
            fmt = cls.RGB
        if qimage_format == QImage.Format.Format_RGBA8888:
            fmt = cls.RGBA
        return fmt  # type: ignore[return-value]

    def to_pil_mode(self) -> str:
        """Convert to PIL image mode."""
        mode: Literal["", "L", "RGB", "RGBA"] = ""
        if self is self.__class__.Greyscale:
            mode = "L"
        elif self is self.__class__.RGB:
            mode = "RGB"
        elif self is self.__class__.RGBA:
            mode = "RGBA"
        return mode

    @classmethod
    def from_pil_mode(cls, mode: Literal["L", "RGB", "RGBA"]) -> Self:
        """Create from PIL image mode."""
        fmt = cls.Invalid
        if mode == "L":
            fmt = cls.Greyscale
        elif mode == "RGB":
            fmt = cls.RGB
        elif mode == "RGBA":
            fmt = cls.RGBA
        return fmt  # type: ignore[return-value]


@dataclass
class TPCMipmap:
    """A single mipmap level in a TPC texture."""

    width: int
    height: int
    tpc_format: TPCTextureFormat
    data: bytearray

    @property
    def size(self) -> int:
        """Get the size of the mipmap data in bytes."""
        return len(self.data)

    def to_qicon(self) -> QIcon:
        """Convert to Qt icon."""
        from qtpy.QtGui import QIcon, QPixmap, QTransform

        pixmap: QPixmap = QPixmap.fromImage(self.to_qimage()).transformed(QTransform().scale(1, -1))
        return QIcon(pixmap)

    def to_qimage(self) -> QImage:
        """Convert to Qt image."""
        from qtpy.QtGui import QImage

        return QImage(bytes(self.data), self.width, self.height, self.tpc_format.to_qimage_format())

    def to_pil_image(self) -> Image.Image:
        """Convert to PIL image."""
        from PIL import Image

        return Image.frombytes(self.tpc_format.to_pil_mode(), (self.width, self.height), self.data)

    def convert(self, target: TPCTextureFormat):
        """Convert the mipmap to a different format."""
        if self.tpc_format == target:
            return

        if self.tpc_format == TPCTextureFormat.RGBA:
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgba_to_rgb(self.data))
            elif target is TPCTextureFormat.RGB:
                self.data = rgba_to_rgb(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgba_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(rgba_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(self.data, self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(self.data, self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.RGB:
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = rgb_to_rgba(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgb_to_bgra(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgb_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(self.data, self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(rgb_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(rgb_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.BGR:
            if target is TPCTextureFormat.RGB:
                self.data = bgr_to_rgb(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = bgr_to_rgba(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = bgr_to_bgra(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = bgr_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(bgr_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(bgr_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(bgr_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.BGRA:
            if target is TPCTextureFormat.BGR:
                self.data = bgra_to_bgr(self.data)
            elif target is TPCTextureFormat.RGB:
                self.data = bgra_to_rgb(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = bgra_to_rgba(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = bgra_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(bgra_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(bgra_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(bgra_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.Greyscale:
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(grey_to_rgb(self.data))
            elif target is TPCTextureFormat.RGB:
                self.data = grey_to_rgb(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = grey_to_rgba(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(grey_to_rgba(self.data))
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(grey_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(grey_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(grey_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.DXT1:
            rgb_data: bytearray = dxt1_to_rgb(self.data, self.width, self.height)
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgb_data)
            elif target is TPCTextureFormat.RGB:
                self.data = rgb_data
            elif target is TPCTextureFormat.RGBA:
                self.data = rgb_to_rgba(rgb_data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(rgb_to_rgba(rgb_data))
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgb_to_grey(rgb_data)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(rgb_to_rgba(rgb_data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(rgb_to_rgba(rgb_data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.DXT3:
            rgba_data: bytearray = dxt3_to_rgba(self.data, self.width, self.height)
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgba_to_rgb(rgba_data))
            elif target is TPCTextureFormat.RGB:
                self.data = rgba_to_rgb(rgba_data)
            elif target is TPCTextureFormat.RGBA:
                self.data = rgba_data
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(rgba_data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgba_to_grey(rgba_data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(rgba_to_rgb(rgba_data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(rgba_data, self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.DXT5:
            rgba_data = dxt5_to_rgba(self.data, self.width, self.height)
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgba_to_rgb(rgba_data))
            elif target is TPCTextureFormat.RGB:
                self.data = rgba_to_rgb(rgba_data)
            elif target is TPCTextureFormat.RGBA:
                self.data = rgba_data
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(rgba_data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgba_to_grey(rgba_data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(rgba_to_rgb(rgba_data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(rgba_data, self.width, self.height)

        self.tpc_format = target

    def copy(self) -> Self:
        """Create a deep copy of this mipmap."""
        return self.__class__(self.width, self.height, self.tpc_format, self.data.copy())


@dataclass
class TPCLayer:
    """A layer in a TPC texture, containing mipmaps."""

    mipmaps: list[TPCMipmap] = field(default_factory=list)

    def set_single(
        self,
        width: int,
        height: int,
        data: bytes | bytearray,
        tpc_format: TPCTextureFormat,
    ):
        """Given a single mipmap, progressively create smaller mipmaps and set them all to the layer."""
        if not isinstance(data, bytearray):
            data = bytearray(data)
        self.mipmaps.clear()
        mm_width, mm_height = width, height

<<<<<<< HEAD
        while mm_width > 0 and mm_height > 0:
            w, h = max(1, mm_width), max(1, mm_height)
            mm = TPCMipmap(
                width=w,
                height=h,
                tpc_format=tpc_format,
                data=data,
=======
        Args:
        ----
            width: The new width.
            height: The new height.
            data: The new texture data.
            texture_format: The texture format.
        """
        self.set_data(width, height, [data], texture_format)

    def set_data(
        self,
        width: int,
        height: int,
        mipmaps: list[bytes],
        texture_format: TPCTextureFormat,
    ):
        """Sets the new texture data.

        Args:
        ----
            width: The new width.
            height: The new height.
            mipmaps: The new mipmaps data.
            texture_format: The texture format.
        """
        # TODO(NickHugi): Some sort of simple sanity check on the data; make sure the mipmaps' data have the appropriate size

        self._texture_format = texture_format
        self._mipmaps = mipmaps
        self._width = width
        self._height = height

    def is_compressed(
        self,
    ) -> bool:
        return self._texture_format in {TPCTextureFormat.DXT1, TPCTextureFormat.DXT5}

    def _mipmap_size(
        self,
        mipmap: int,
    ) -> tuple[int, int]:
        """Returns the size of the specified mipmap.

        Args:
        ----
            mipmap: The index of the mipmap.

        Raises:
        ------
            IndexError: The index for the mipmap is out of range.

        Returns:
        -------
            A tuple equal to (width, height).
        """
        if 0 > mipmap >= len(self._mipmaps):
            msg = "The index for the mipmap is out of range."
            raise IndexError(msg)

        width = self._width
        height = self._height
        for _ in range(mipmap):
            width >>= 1
            height >>= 1
        return width, height

    @staticmethod
    def _calculate_color_indices(
        rgba_block: list[tuple[int, int, int, int]],
        c0: tuple[int, int, int],
        c1: tuple[int, int, int],
    ) -> int:
        """Calculate 2-bit indices for each pixel in a 4x4 block."""
        indices: int = 0
        for i, pixel in enumerate(rgba_block):
            r, g, b, _a = pixel
            dr0, dg0, db0 = r - c0[0], g - c0[1], b - c0[2]
            dr1, dg1, db1 = r - c1[0], g - c1[1], b - c1[2]
            distance0 = dr0**2 + dg0**2 + db0**2
            distance1 = dr1**2 + dg1**2 + db1**2
            index = 0 if distance0 < distance1 else 1
            indices |= index << (i * 2)
        return indices

    @staticmethod
    def _select_representative_colors(rgba_block: list[tuple[int, int, int, int]]) -> tuple[tuple[int, int, int], tuple[int, int, int]]:
        """Select representative colors for DXT1 compression."""
        colors = sorted(rgba_block, key=lambda x: (x[0] << 16) + (x[1] << 8) + x[2])
        return colors[0][:3], colors[-1][:3]

    @staticmethod
    def rgba_to_dxt1(
        rgba_data: bytes,
        width: int,
        height: int,
    ) -> bytearray:
        """Convert RGBA data to DXT1 compressed format."""
        compressed_data = bytearray()
        for y, x in tpc_itertools.product(range(0, height, 4), range(0, width, 4)):
            rgba_block: list[tuple[int, int, int, int]] = [
                cast("Tuple[int, int, int, int]", tuple(rgba_data[i : i + 4]))
                for dy in range(4)
                for dx in range(4)
                for i in range((y * width + x + dy * width + dx) * 4, (y * width + x + dy * width + dx) * 4 + 4, 4)
            ]
            c0, c1 = TPC._select_representative_colors(rgba_block)
            c0_565 = TPC._rgb_to_rgba565(c0)
            c1_565 = TPC._rgb_to_rgba565(c1)
            indices = TPC._calculate_color_indices(rgba_block, c0, c1)
            compressed_data += c0_565.to_bytes(2, byteorder="little")
            compressed_data += c1_565.to_bytes(2, byteorder="little")
            compressed_data += indices.to_bytes(4, byteorder="little")
        return compressed_data

    # region Convert to RGBA
    @staticmethod
    def _dxt5_to_rgba(
        data: bytes,
        width: int,
        height: int,
    ) -> bytearray:  # sourcery skip: merge-list-appends-into-extend
        """Converts DXT5 compressed texture data to RGBA bytes.

        Args:
        ----
            data: bytes - The compressed DXT5 texture data
            width: int - Width of the texture
            height: int - Height of the texture

        Returns:
        -------
            bytearray - Uncompressed RGBA pixel data

        Processing Logic:
        ----------------
            - Reads the compressed DXT5 data using a BinaryReader
            - Loops through each 4x4 block
                - Decodes the alpha and color data
                - Decompresses the pixel colors and alphas
                - Writes the RGBA values to the output byte array
            - Returns the uncompressed pixel data.
        """
        dxt_reader: BinaryReader = BinaryReader.from_bytes(data)
        new_data = bytearray(width * height * 4)

        for ty, tx in tpc_itertools.product(range(4, height + 4, 4), range(0, width, 4)):
            alpha0 = dxt_reader.read_uint8()
            alpha1 = dxt_reader.read_uint8()
            dxt_alpha = TPC._integer48(dxt_reader.read_bytes(6))

            x = dxt_reader.read_int16()
            y = dxt_reader.read_int16()
            c0 = TPC._rgba565_to_rgb(x)
            c1 = TPC._rgba565_to_rgb(y)
            dxt_pixels = dxt_reader.read_uint32(big=True)

            cc = [c0, c1]
            if TPC._rgba565_to_rgb888(x) > TPC._rgba565_to_rgb888(y):
                cc.extend(
                    [
                        TPC._interpolate_rgb(0.3333333, c0, c1),
                        TPC._interpolate_rgb(0.6666666, c0, c1),
                    ],
                )
            else:
                cc.extend(
                    [
                        TPC._interpolate_rgb(0.5555555, c0, c1),
                        (0, 0, 0),
                    ]
                )

            alpha_code = [alpha0, alpha1]
            if alpha0 > alpha1:
                alpha_code.extend(
                    (
                        int((6.0 * alpha0 + 1.0 * alpha1 + 3) / 7),
                        int((5.0 * alpha0 + 2.0 * alpha1 + 3) / 7),
                        int((4.0 * alpha0 + 3.0 * alpha1 + 3) / 7),
                        int((3.0 * alpha0 + 4.0 * alpha1 + 3) / 7),
                        int((2.0 * alpha0 + 5.0 * alpha1 + 3) / 7),
                        int((1.0 * alpha0 + 6.0 * alpha1 + 3) / 7),
                    )
                )
            else:
                alpha_code.extend(
                    (
                        int((4.0 * alpha0 + 1.0 * alpha1 + 1) / 5),
                        int((3.0 * alpha0 + 2.0 * alpha1 + 2) / 5),
                        int((2.0 * alpha0 + 3.0 * alpha1 + 2) / 5),
                        int((1.0 * alpha0 + 4.0 * alpha1 + 2) / 5),
                        0,
                        255,
                    )
                )
            for y in (3, 2, 1, 0):
                for x in (0, 1, 2, 3):
                    pixelc_code = dxt_pixels & 3
                    dxt_pixels >>= 2

                    a = alpha_code[(dxt_alpha >> (3 * (4 * y + x))) & 7]

                    index = ((ty - 4 + y) * width + (tx + x)) * 4
                    new_data[index + 0] = cc[pixelc_code][0]
                    new_data[index + 1] = cc[pixelc_code][1]
                    new_data[index + 2] = cc[pixelc_code][2]
                    new_data[index + 3] = a

        return new_data

    @staticmethod
    def _dxt1_to_rgba(
        data: bytes,
        width: int,
        height: int,
    ) -> bytearray:
        """Converts DXT1 compressed texture data to RGBA format.

        Args:
        ----
            data: bytes - The compressed DXT1 texture data
            width: int - Width of the texture
            height: int - Height of the texture

        Returns:
        -------
            bytearray - Uncompressed RGBA texture data

        Processing Logic:
        ----------------
            - Parse the DXT1 data using a BinaryReader
            - Iterate over 4x4 pixel blocks
            - Decode the color values and interpolation data
            - Extract and interpolate the RGBA values for each pixel
            - Write the uncompressed RGBA values to a bytearray.
        """
        dxt_reader: BinaryReader = BinaryReader.from_bytes(data)
        new_data = bytearray(width * height * 4)

        for ty, tx in tpc_itertools.product(range(4, height + 4, 4), range(0, width, 4)):
            x = dxt_reader.read_int16()
            y = dxt_reader.read_int16()
            c0: tuple[int, int, int] = TPC._rgba565_to_rgb(x)
            c1: tuple[int, int, int] = TPC._rgba565_to_rgb(y)
            dxt_pixels = dxt_reader.read_uint32(big=True)

            cc: list[tuple[int, int, int]] = [c0, c1]
            if TPC._rgba565_to_rgb888(x) > TPC._rgba565_to_rgb888(y):
                cc.extend(
                    [
                        TPC._interpolate_rgb(0.3333333, c0, c1),
                        TPC._interpolate_rgb(0.6666666, c0, c1),
                    ],
                )
            else:
                cc.extend([TPC._interpolate_rgb(0.5555555, c0, c1), (0, 0, 0)])

            for y in (3, 2, 1, 0):
                for x in (0, 1, 2, 3):
                    pixelc_code = dxt_pixels & 3
                    dxt_pixels >>= 2

                    index = ((ty - 4 + y) * width + (tx + x)) * 4
                    new_data[index + 0] = cc[pixelc_code][0]
                    new_data[index + 1] = cc[pixelc_code][1]
                    new_data[index + 2] = cc[pixelc_code][2]
                    new_data[index + 3] = 255

        return new_data

    @staticmethod
    def _rgb_to_rgba(
        data: bytes,
        width: int,
        height: int,
    ) -> bytearray:
        new_data = bytearray()
        rgb_reader = BinaryReader.from_bytes(data)

        for _ty, _x in tpc_itertools.product(range(4, height + 4, 4), range(width)):
            new_data.extend(
                [
                    rgb_reader.read_uint8(),
                    rgb_reader.read_uint8(),
                    rgb_reader.read_uint8(),
                    255,
                ],
>>>>>>> upstream-master
            )
            self.mipmaps.append(mm)

            mm_width >>= 1
            mm_height >>= 1

<<<<<<< HEAD
            # Generate the next mipmap data by downsampling
            if w > 1 and h > 1:
                RobustLogger().debug(f"Downsampling mipmap ({w}x{h}) to {mm_width}x{mm_height}")
                data = self._downsample(data, w, h, tpc_format)
=======
    @staticmethod
    def _grey_to_rgba(
        data: bytes,
        width: int,
        height: int,
    ) -> bytearray:
        new_data = bytearray()
        rgb_reader = BinaryReader.from_bytes(data)

        for _y, _x in tpc_itertools.product(range(height), range(width)):
            brightness = rgb_reader.read_uint8()
            new_data.extend([brightness, brightness, brightness, 255])

        return new_data

    # endregion

    # region Convert to Grey
    @staticmethod
    def _rgba_to_grey(
        data: bytes,
        width: int,
        height: int,
    ) -> bytearray:
        new_data = bytearray()
        rgb_reader = BinaryReader.from_bytes(data)

        for _y, _x in tpc_itertools.product(range(height), range(width)):
            r = rgb_reader.read_uint8()
            g = rgb_reader.read_uint8()
            b = rgb_reader.read_uint8()
            rgb_reader.read_uint8()
            highest = r
            highest = max(highest, g)
            highest = max(highest, b)
            new_data.extend([highest])

        return new_data

    # endregion

    # region Convert to RGB
    @staticmethod
    def _dxt5_to_rgb(
        data: bytes,
        width: int,
        height: int,
    ) -> bytearray:
        dxt_reader = BinaryReader.from_bytes(data)
        new_data = bytearray(width * height * 3)

        for ty, tx in tpc_itertools.product(range(4, height + 4, 4), range(0, width, 4)):
            dxt_reader.skip(8)

            x = dxt_reader.read_int16()
            y = dxt_reader.read_int16()
            c0: tuple[int, int, int] = TPC._rgba565_to_rgb(x)
            c1: tuple[int, int, int] = TPC._rgba565_to_rgb(y)
            dxt_pixels = dxt_reader.read_uint32(big=True)

            cc: list[tuple[int, int, int]] = [c0, c1]
            if TPC._rgba565_to_rgb888(x) > TPC._rgba565_to_rgb888(y):
                cc.extend(
                    [
                        TPC._interpolate_rgb(0.3333333, c0, c1),
                        TPC._interpolate_rgb(0.6666666, c0, c1),
                    ],
                )
>>>>>>> upstream-master
            else:
                break

            if mm_width < 1 or mm_height < 1:
                break

    @classmethod
    def _downsample(
        cls,
        data: bytearray,
        width: int,
        height: int,
        tpc_format: TPCTextureFormat,
    ) -> bytearray:
        """Downsample the given mipmap data to the next smaller mipmap size."""
        if tpc_format.is_dxt():
            return downsample_dxt(data, width, height, tpc_format.bytes_per_block())
        return downsample_rgb(data, width, height, tpc_format.bytes_per_pixel())

    def copy(self) -> Self:
        """Create a deep copy of this layer."""
        return self.__class__([mipmap.copy() for mipmap in self.mipmaps])


class TPC(ComparableMixin):
    """BioWare's TPC texture format used in Knights of the Old Republic."""

    def bytes_per_block(self) -> Literal[1, 8, 16]:
        """Get the number of bytes per block for this format."""
        if not self.is_dxt():
            return 1
        return 8 if self is TPCTextureFormat.DXT1 else 16

    BINARY_TYPE = ResourceType.TPC
    BLANK_LAYER = TPCLayer(
        [
            TPCMipmap(
                width,
                height,
                TPCTextureFormat.RGBA,
                bytearray(0 for _ in range(width * height * 4)),
            )
            for width, height in ((256, 256), (128, 128), (64, 64), (32, 32), (16, 16), (8, 8), (4, 4), (2, 2), (1, 1))
        ]
    )

    def __init__(self):
        self._txi: TXI = TXI()
        self._format: TPCTextureFormat = TPCTextureFormat.Invalid
        self.layers: list[TPCLayer] = []
        self.is_animated: bool = False
        self.is_cube_map: bool = False

    @classmethod
    def from_blank(cls) -> Self:
        """Create a blank TPC texture."""
        instance = cls()
        instance.layers = [cls.BLANK_LAYER]
        instance._format = TPCTextureFormat.RGBA  # noqa: SLF001
        return instance

    @property
    def txi(self) -> str:
        """Get the TXI data as a string."""
        return str(self._txi)

    @txi.setter
    def txi(self, value: str):
        """Set the TXI data from a string."""
        self._txi.load(value)

    def format(self) -> TPCTextureFormat:
        """Get the texture format."""
        return self._format

    def is_compressed(self) -> bool:
        """Check if the texture is compressed."""
        return self._format in {TPCTextureFormat.DXT1, TPCTextureFormat.DXT3, TPCTextureFormat.DXT5}

    def mipmap_size(self, layer: int, mipmap: int) -> tuple[int, int]:
        """Get the dimensions of a specific mipmap."""
        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]
        return mm.width, mm.height

    def dimensions(self) -> tuple[int, int]:
        """Get the dimensions of the texture."""
        if not self.layers:
            return 0, 0
        return self.layers[0].mipmaps[0].width, self.layers[0].mipmaps[0].height

    def get(self, layer: int, mipmap: int) -> TPCMipmap:
        """Get a specific mipmap."""
        return self.layers[layer].mipmaps[mipmap]

    def set_single(self, data: bytes | bytearray, tpc_format: TPCTextureFormat, width: int, height: int):
        """Set a single texture layer with the given data."""
        self.layers = [TPCLayer()]
        self.is_cube_map = False
        self.is_animated = False
        self.layers[0].set_single(width, height, data, tpc_format)
        self._format = tpc_format

    def rotate90(self, times: int) -> None:
        """Rotate all mipmaps in 90° steps, clock-wise for positive times, counter-clockwise for negative times."""
        times = times % 4  # Normalize rotation to 0-3
        if times == 0:
            return  # No rotation needed

        for layer in self.layers:
            for mipmap in layer.mipmaps:
                if self._format == TPCTextureFormat.DXT1:
                    mipmap.data = rotate_dxt1(mipmap.data, mipmap.width, mipmap.height, times)
                elif self._format == TPCTextureFormat.DXT5:
                    mipmap.data = rotate_dxt5(mipmap.data, mipmap.width, mipmap.height, times)
                elif not self._format.is_dxt():
                    mipmap.data = rotate_rgb_rgba(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_pixel(), times)
                else:
                    raise ValueError(f"Unsupported format for rotation: {self._format}")

                # Swap width and height for 90° or 270° rotations
                if times % 2 != 0:
                    mipmap.width, mipmap.height = mipmap.height, mipmap.width

    def flip_vertically(self) -> None:
        """Flip all mipmaps vertically."""
        for layer in self.layers:
            for mipmap in layer.mipmaps:
                if self._format.is_dxt():
                    mipmap.data = flip_vertically_dxt(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_block())
                else:
                    mipmap.data = flip_vertically_rgb_rgba(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_pixel())

    def flip_horizontally(self) -> None:
        """Flip all mipmaps horizontally."""
        for layer in self.layers:
            for mipmap in layer.mipmaps:
                if self._format.is_dxt():
                    mipmap.data = flip_horizontally_dxt(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_block())
                else:
                    mipmap.data = flip_horizontally_rgb_rgba(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_pixel())

    def convert(self, target: TPCTextureFormat) -> None:
        """Convert the TPC texture to the specified target format."""
        if self._format == target:
            return

        for layer in self.layers:
            for mipmap in layer.mipmaps:
                mipmap.convert(target)

        self._format = target

    def decode(self):
        """Decode compressed formats to their uncompressed equivalents."""
        if self.format() in (TPCTextureFormat.BGR, TPCTextureFormat.DXT1, TPCTextureFormat.Greyscale):
            self.convert(TPCTextureFormat.RGB)
        elif self.format() in (TPCTextureFormat.BGRA, TPCTextureFormat.DXT3, TPCTextureFormat.DXT5):
            self.convert(TPCTextureFormat.RGBA)

    def encode(self):
        """Encode uncompressed formats to their compressed equivalents."""
        if self.format() in (TPCTextureFormat.RGB, TPCTextureFormat.BGR, TPCTextureFormat.Greyscale):
            self.convert(TPCTextureFormat.DXT1)
        elif self.format() in (TPCTextureFormat.RGBA, TPCTextureFormat.BGRA, TPCTextureFormat.DXT5):
            self.convert(TPCTextureFormat.DXT5)

    @staticmethod
    def _integer48(
        bytes48: bytes,
    ) -> int:
        return (
            bytes48[0]
            + (bytes48[1] << 8)
            + (bytes48[2] << 16)
            + (bytes48[3] << 24)
            + (bytes48[4] << 32)
            + (bytes48[5] << 40)
        )

    def copy(self) -> Self:
        """Create a deep copy of this TPC texture."""
        instance: Self = self.__class__.from_blank()
        instance.layers[:] = (layer.copy() for layer in self.layers)
        instance._format = self._format  # noqa: SLF001
        instance.is_animated = self.is_animated
        instance.is_cube_map = self.is_cube_map
        instance._txi = self._txi  # noqa: SLF001
        return instance
```

please merge and solve the conflicts.

## Assistant

_Time: 2025-11-08T14:02:58.394Z_

```python
"""This module handles classes relating to editing TPC files."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import IntEnum, auto
from typing import TYPE_CHECKING

from loggerplus import RobustLogger
from pykotor.common.stream import BinaryReader
from pykotor.resource.formats._base import ComparableMixin
from pykotor.resource.formats.tpc.convert.bgra import (
    bgr_to_bgra,
    bgr_to_grey,
    bgr_to_rgb,
    bgr_to_rgba,
    bgra_to_bgr,
    bgra_to_grey,
    bgra_to_rgb,
    bgra_to_rgba,
    rgb_to_bgr,
    rgb_to_bgra,
    rgba_to_bgra,
)
from pykotor.resource.formats.tpc.convert.dxt.compress_dxt import rgb_to_dxt1, rgba_to_dxt3, rgba_to_dxt5
from pykotor.resource.formats.tpc.convert.dxt.decompress_dxt import dxt1_to_rgb, dxt3_to_rgba, dxt5_to_rgba
from pykotor.resource.formats.tpc.convert.rgb import grey_to_rgb, grey_to_rgba, rgb_to_grey, rgb_to_rgba, rgba_to_grey, rgba_to_rgb
from pykotor.resource.formats.tpc.manipulate.downsample import downsample_dxt, downsample_rgb
from pykotor.resource.formats.tpc.manipulate.dxt_manipulate import flip_horizontally_dxt, flip_vertically_dxt, rotate_dxt1, rotate_dxt5
from pykotor.resource.formats.tpc.manipulate.rotate import flip_horizontally_rgb_rgba, flip_vertically_rgb_rgba, rotate_rgb_rgba
from pykotor.resource.formats.txi.txi_data import TXI
from pykotor.resource.type import ResourceType

if TYPE_CHECKING:
    from PIL import Image
    from qtpy.QtGui import QIcon, QImage, QPixmap
    from typing_extensions import Literal, Self  # pyright: ignore[reportMissingModuleSource]


class TPCTextureFormat(IntEnum):
    """Enumeration of supported TPC texture formats."""

    Invalid = -1
    Greyscale = 0
    DXT1 = auto()
    DXT3 = auto()
    DXT5 = auto()
    RGB = auto()
    RGBA = auto()
    BGRA = auto()
    BGR = auto()

    def block_size(self) -> Literal[1, 4]:
        """Get the block size for this format."""
        return 4 if self.is_dxt() else 1

    def bytes_per_pixel(self) -> Literal[1, 3, 4]:
        """Get the number of bytes per pixel for this format."""
        bytes_per_pixel = 0
        if self is self.Greyscale:
            bytes_per_pixel = 1
        elif self.is_dxt():
            bytes_per_pixel = 1  # technically incorrect.
        elif self in (self.RGB, self.BGR):
            bytes_per_pixel = 3
        elif self in (self.RGBA, self.BGRA):
            bytes_per_pixel = 4
        return bytes_per_pixel

    def is_dxt(self) -> bool:
        """Check if this format is a DXT compression format."""
        return self in (
            self.DXT1,
            self.DXT3,
            self.DXT5,
        )

    def bytes_per_block(self) -> Literal[1, 8, 16]:
        """Get the number of bytes per block for this format."""
        if not self.is_dxt():
            return 1
        return 8 if self is self.DXT1 else 16

    def min_size(self) -> Literal[0, 1, 3, 4, 8, 16]:
        """Get the minimum size in bytes for this format."""
        min_size: int = 0
        if self is self.Greyscale:
            min_size = 1
        elif self in (self.RGB, self.BGR):
            min_size = 3
        elif self in (self.RGBA, self.BGRA):
            min_size = 4
        elif self.is_dxt():
            min_size = self.bytes_per_block()
        return min_size

    def get_size(self, width: int, height: int) -> int:
        """Calculate the size in bytes needed for an image of the given dimensions."""
        size: int = 0
        if self.is_dxt():
            bytes_per_block = self.bytes_per_block()
            size = ((width + 3) // 4) * ((height + 3) // 4) * bytes_per_block
        else:
            size = width * height * self.bytes_per_pixel()
        return max(self.min_size(), size)

    def to_qimage_format(self) -> QImage.Format:
        """Convert to Qt image format."""
        from qtpy.QtGui import QImage

        q_format = QImage.Format.Format_Invalid
        if self is self.Greyscale:
            q_format = QImage.Format.Format_Grayscale8
        elif self is self.RGB:
            q_format = QImage.Format.Format_RGB888
        elif self is self.BGR:
            q_format = QImage.Format.Format_BGR888
        elif self is self.RGBA:
            q_format = QImage.Format.Format_RGBA8888
        elif self is self.BGRA:
            q_format = QImage.Format.Format_ARGB32
        else:
            raise ValueError(f"Unsupported format: {self!r}")
        return q_format

    @classmethod
    def from_qimage_format(cls, qimage_format: QImage.Format) -> Self:
        """Create from Qt image format."""
        from qtpy.QtGui import QImage

        fmt = cls.Invalid
        if qimage_format == QImage.Format.Format_Grayscale8:
            fmt = cls.Greyscale
        if qimage_format == QImage.Format.Format_RGB888:
            fmt = cls.RGB
        if qimage_format == QImage.Format.Format_RGBA8888:
            fmt = cls.RGBA
        return fmt  # type: ignore[return-value]

    def to_pil_mode(self) -> str:
        """Convert to PIL image mode."""
        mode: Literal["", "L", "RGB", "RGBA"] = ""
        if self is self.Greyscale:
            mode = "L"
        elif self is self.RGB:
            mode = "RGB"
        elif self is self.RGBA:
            mode = "RGBA"
        return mode

    @classmethod
    def from_pil_mode(cls, mode: Literal["L", "RGB", "RGBA"]) -> Self:
        """Create from PIL image mode."""
        fmt = cls.Invalid
        if mode == "L":
            fmt = cls.Greyscale
        elif mode == "RGB":
            fmt = cls.RGB
        elif mode == "RGBA":
            fmt = cls.RGBA
        return fmt  # type: ignore[return-value]


@dataclass
class TPCMipmap:
    """A single mipmap level in a TPC texture."""

    width: int
    height: int
    tpc_format: TPCTextureFormat
    data: bytearray

    @property
    def size(self) -> int:
        """Get the size of the mipmap data in bytes."""
        return len(self.data)

    def to_qicon(self) -> QIcon:
        """Convert to Qt icon."""
        from qtpy.QtGui import QIcon, QPixmap, QTransform

        pixmap: QPixmap = QPixmap.fromImage(self.to_qimage()).transformed(QTransform().scale(1, -1))
        return QIcon(pixmap)

    def to_qimage(self) -> QImage:
        """Convert to Qt image."""
        from qtpy.QtGui import QImage

        return QImage(bytes(self.data), self.width, self.height, self.tpc_format.to_qimage_format())

    def to_pil_image(self) -> Image.Image:
        """Convert to PIL image."""
        from PIL import Image

        return Image.frombytes(self.tpc_format.to_pil_mode(), (self.width, self.height), self.data)

    def convert(self, target: TPCTextureFormat):
        """Convert the mipmap to a different format."""
        if self.tpc_format == target:
            return

        if self.tpc_format == TPCTextureFormat.RGBA:
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgba_to_rgb(self.data))
            elif target is TPCTextureFormat.RGB:
                self.data = rgba_to_rgb(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgba_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(rgba_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(self.data, self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(self.data, self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.RGB:
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = rgb_to_rgba(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgb_to_bgra(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgb_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(self.data, self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(rgb_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(rgb_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.BGR:
            if target is TPCTextureFormat.RGB:
                self.data = bgr_to_rgb(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = bgr_to_rgba(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = bgr_to_bgra(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = bgr_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(bgr_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(bgr_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(bgr_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.BGRA:
            if target is TPCTextureFormat.BGR:
                self.data = bgra_to_bgr(self.data)
            elif target is TPCTextureFormat.RGB:
                self.data = bgra_to_rgb(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = bgra_to_rgba(self.data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = bgra_to_grey(self.data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(bgra_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(bgra_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(bgra_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.Greyscale:
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(grey_to_rgb(self.data))
            elif target is TPCTextureFormat.RGB:
                self.data = grey_to_rgb(self.data)
            elif target is TPCTextureFormat.RGBA:
                self.data = grey_to_rgba(self.data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(grey_to_rgba(self.data))
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(grey_to_rgb(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(grey_to_rgba(self.data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(grey_to_rgba(self.data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.DXT1:
            rgb_data: bytearray = dxt1_to_rgb(self.data, self.width, self.height)
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgb_data)
            elif target is TPCTextureFormat.RGB:
                self.data = rgb_data
            elif target is TPCTextureFormat.RGBA:
                self.data = rgb_to_rgba(rgb_data)
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(rgb_to_rgba(rgb_data))
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgb_to_grey(rgb_data)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(rgb_to_rgba(rgb_data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(rgb_to_rgba(rgb_data), self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.DXT3:
            rgba_data: bytearray = dxt3_to_rgba(self.data, self.width, self.height)
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgba_to_rgb(rgba_data))
            elif target is TPCTextureFormat.RGB:
                self.data = rgba_to_rgb(rgba_data)
            elif target is TPCTextureFormat.RGBA:
                self.data = rgba_data
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(rgba_data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgba_to_grey(rgba_data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(rgba_to_rgb(rgba_data), self.width, self.height)
            elif target is TPCTextureFormat.DXT5:
                self.data = rgba_to_dxt5(rgba_data, self.width, self.height)

        elif self.tpc_format == TPCTextureFormat.DXT5:
            rgba_data = dxt5_to_rgba(self.data, self.width, self.height)
            if target is TPCTextureFormat.BGR:
                self.data = rgb_to_bgr(rgba_to_rgb(rgba_data))
            elif target is TPCTextureFormat.RGB:
                self.data = rgba_to_rgb(rgba_data)
            elif target is TPCTextureFormat.RGBA:
                self.data = rgba_data
            elif target is TPCTextureFormat.BGRA:
                self.data = rgba_to_bgra(rgba_data)
            elif target is TPCTextureFormat.Greyscale:
                self.data = rgba_to_grey(rgba_data)
            elif target is TPCTextureFormat.DXT1:
                self.data = rgb_to_dxt1(rgba_to_rgb(rgba_data), self.width, self.height)
            elif target is TPCTextureFormat.DXT3:
                self.data = rgba_to_dxt3(rgba_data, self.width, self.height)

        self.tpc_format = target

    def copy(self) -> Self:
        """Create a deep copy of this mipmap."""
        return self.__class__(self.width, self.height, self.tpc_format, self.data.copy())


@dataclass
class TPCLayer:
    """A layer in a TPC texture, containing mipmaps."""

    mipmaps: list[TPCMipmap] = field(default_factory=list)

    def set_single(
        self,
        width: int,
        height: int,
        data: bytes | bytearray,
        tpc_format: TPCTextureFormat,
    ):
        """Given a single mipmap, progressively create smaller mipmaps and set them all to the layer."""
        if not isinstance(data, bytearray):
            data = bytearray(data)
        self.mipmaps.clear()
        mm_width, mm_height = width, height

        while mm_width > 0 and mm_height > 0:
            w, h = max(1, mm_width), max(1, mm_height)
            mm = TPCMipmap(
                width=w,
                height=h,
                tpc_format=tpc_format,
                data=data,
            )
            self.mipmaps.append(mm)

            mm_width >>= 1
            mm_height >>= 1

            # Generate the next mipmap data by downsampling
            if w > 1 and h > 1:
                RobustLogger().debug(f"Downsampling mipmap ({w}x{h}) to {mm_width}x{mm_height}")
                data = self._downsample(data, w, h, tpc_format)
            else:
                break

            if mm_width < 1 or mm_height < 1:
                break

    def set_data(
        self,
        width: int,
        height: int,
        mipmaps: list[bytes],
        texture_format: TPCTextureFormat,
    ):
        """Sets the new texture data.

        Args:
        ----
            width: The new width.
            height: The new height.
            mipmaps: The new mipmaps data.
            texture_format: The texture format.
        """
        # TODO(NickHugi): Some sort of simple sanity check on the data; make sure the mipmaps' data have the appropriate size

        self.mipmaps.clear()
        mm_width, mm_height = width, height
        for mipmap_data in mipmaps:
            w, h = max(1, mm_width), max(1, mm_height)
            self.mipmaps.append(TPCMipmap(w, h, texture_format, bytearray(mipmap_data)))
            mm_width >>= 1
            mm_height >>= 1

    @classmethod
    def _downsample(
        cls,
        data: bytearray,
        width: int,
        height: int,
        tpc_format: TPCTextureFormat,
    ) -> bytearray:
        """Downsample the given mipmap data to the next smaller mipmap size."""
        if tpc_format.is_dxt():
            return downsample_dxt(data, width, height, tpc_format.bytes_per_block())
        return downsample_rgb(data, width, height, tpc_format.bytes_per_pixel())

    def copy(self) -> Self:
        """Create a deep copy of this layer."""
        return self.__class__([mipmap.copy() for mipmap in self.mipmaps])


class TPC(ComparableMixin):
    """BioWare's TPC texture format used in Knights of the Old Republic."""

    BINARY_TYPE = ResourceType.TPC
    BLANK_LAYER = TPCLayer(
        [
            TPCMipmap(
                width,
                height,
                TPCTextureFormat.RGBA,
                bytearray(0 for _ in range(width * height * 4)),
            )
            for width, height in ((256, 256), (128, 128), (64, 64), (32, 32), (16, 16), (8, 8), (4, 4), (2, 2), (1, 1))
        ]
    )

    def __init__(self):
        self._txi: TXI = TXI()
        self._format: TPCTextureFormat = TPCTextureFormat.Invalid
        self.layers: list[TPCLayer] = []
        self.is_animated: bool = False
        self.is_cube_map: bool = False

    @classmethod
    def from_blank(cls) -> Self:
        """Create a blank TPC texture."""
        instance = cls()
        instance.layers = [cls.BLANK_LAYER]
        instance._format = TPCTextureFormat.RGBA
        return instance

    @property
    def txi(self) -> str:
        """Get the TXI data as a string."""
        return str(self._txi)

    @txi.setter
    def txi(self, value: str):
        """Set the TXI data from a string."""
        self._txi.load(value)

    def format(
        self,
    ) -> TPCTextureFormat:
        """Get the texture format."""
        return self._format

    def is_compressed(
        self,
    ) -> bool:
        """Check if the texture is compressed."""
        return self._format in {TPCTextureFormat.DXT1, TPCTextureFormat.DXT3, TPCTextureFormat.DXT5}

    def mipmap_size(self, layer: int, mipmap: int) -> tuple[int, int]:
        """Get the dimensions of a specific mipmap."""
        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]
        return mm.width, mm.height

    def dimensions(
        self,
    ) -> tuple[int, int]:
        """Get the dimensions of the texture."""
        if not self.layers:
            return 0, 0
        return self.layers[0].mipmaps[0].width, self.layers[0].mipmaps[0].height

    def get(
        self,
        layer: int = 0,
        mipmap: int = 0,
    ) -> TPCMipmap:
        """Get a specific mipmap."""
        return self.layers[layer].mipmaps[mipmap]

    def set_single(self, data: bytes | bytearray, tpc_format: TPCTextureFormat, width: int, height: int):
        """Set a single texture layer with the given data."""
        self.layers = [TPCLayer()]
        self.is_cube_map = False
        self.is_animated = False
        self.layers[0].set_single(width, height, data, tpc_format)
        self._format = tpc_format

    def rotate90(self, times: int) -> None:
        """Rotate all mipmaps in 90° steps, clock-wise for positive times, counter-clockwise for negative times."""
        times = times % 4  # Normalize rotation to 0-3
        if times == 0:
            return  # No rotation needed

        for layer in self.layers:
            for mipmap in layer.mipmaps:
                if self._format == TPCTextureFormat.DXT1:
                    mipmap.data = rotate_dxt1(mipmap.data, mipmap.width, mipmap.height, times)
                elif self._format == TPCTextureFormat.DXT5:
                    mipmap.data = rotate_dxt5(mipmap.data, mipmap.width, mipmap.height, times)
                elif not self._format.is_dxt():
                    mipmap.data = rotate_rgb_rgba(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_pixel(), times)
                else:
                    raise ValueError(f"Unsupported format for rotation: {self._format}")

                # Swap width and height for 90° or 270° rotations
                if times % 2 != 0:
                    mipmap.width, mipmap.height = mipmap.height, mipmap.width

    def flip_vertically(self) -> None:
        """Flip all mipmaps vertically."""
        for layer in self.layers:
            for mipmap in layer.mipmaps:
                if self._format.is_dxt():
                    mipmap.data = flip_vertically_dxt(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_block())
                else:
                    mipmap.data = flip_vertically_rgb_rgba(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_pixel())

    def flip_horizontally(self) -> None:
        """Flip all mipmaps horizontally."""
        for layer in self.layers:
            for mipmap in layer.mipmaps:
                if self._format.is_dxt():
                    mipmap.data = flip_horizontally_dxt(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_block())
                else:
                    mipmap.data = flip_horizontally_rgb_rgba(mipmap.data, mipmap.width, mipmap.height, self._format.bytes_per_pixel())

    def convert(self, target: TPCTextureFormat) -> None:
        """Convert the TPC texture to the specified target format."""
        if self._format == target:
            return

        for layer in self.layers:
            for mipmap in layer.mipmaps:
                mipmap.convert(target)

        self._format = target

    def decode(self):
        """Decode compressed formats to their uncompressed equivalents."""
        if self.format() in (TPCTextureFormat.BGR, TPCTextureFormat.DXT1, TPCTextureFormat.Greyscale):
            self.convert(TPCTextureFormat.RGB)
        elif self.format() in (TPCTextureFormat.BGRA, TPCTextureFormat.DXT3, TPCTextureFormat.DXT5):
            self.convert(TPCTextureFormat.RGBA)

    def encode(self):
        """Encode uncompressed formats to their compressed equivalents."""
        if self.format() in (TPCTextureFormat.RGB, TPCTextureFormat.BGR, TPCTextureFormat.Greyscale):
            self.convert(TPCTextureFormat.DXT1)
        elif self.format() in (TPCTextureFormat.RGBA, TPCTextureFormat.BGRA, TPCTextureFormat.DXT5):
            self.convert(TPCTextureFormat.DXT5)

    @staticmethod
    def _integer48(
        bytes48: bytes,
    ) -> int:
        return (
            bytes48[0]
            + (bytes48[1] << 8)
            + (bytes48[2] << 16)
            + (bytes48[3] << 24)
            + (bytes48[4] << 32)
            + (bytes48[5] << 40)
        )

    def copy(self) -> Self:
        """Create a deep copy of this TPC texture."""
        instance: Self = self.__class__.from_blank()
        instance.layers[:] = (layer.copy() for layer in self.layers)
        instance._format = self._format
        instance.is_animated = self.is_animated
        instance.is_cube_map = self.is_cube_map
        instance._txi = self._txi
        return instance
```
