---
source_url: "https://www.perplexity.ai/search/4cb21890-5b07-4486-9ca7-26f28f7abdd9"
thread_uuid: "271ce213-9ce5-4140-9f61-138b86d16f07"
slug: "4cb21890-5b07-4486-9ca7-26f28f7abdd9"
title: "```

from __future__ import annotations

from dataclasses import dataclass, field

from enum import IntEnum, auto

from typing import TYPE_CHECKING

from pykotor.resource.formats.tpc.bgra_conversions import bgra_to_grey, bgra_to_rgb, bgra_to_rgba, rgba_to_bgra  # noqa: F401

from pykotor.resource.formats.tpc.dxt_conversions import dxt1_to_rgb, dxt5_to_rgba, rgb_to_dxt1, rgba_to_dxt5  # noqa: F401

from pykotor.resource.formats.tpc.greyscale_conversions import grey_to_rgb, grey_to_rgba, rgb_to_grey, rgba_to_grey  # noqa: F401

from pykotor.resource.formats.tpc.rgb_conversions import rgb_to_rgba, rgba_to_rgb  # noqa: F401

from pykotor.resource.formats.txi.txi_data import TXI

from pykotor.resource.type import ResourceType

if TYPE_CHECKING:

    from PIL import Image

    from qtpy.QtGui import QIcon, QImage, QPixmap

    from typing_extensions import Literal, Self



class TPCTextureFormat(IntEnum):

    Invalid = -1

    Greyscale = 0

    DXT1 = auto()

    DXT3 = auto()

    DXT5 = auto()

    RGB = auto()

    RGBA = auto()

    BGRA = auto()

    BGR = auto()

    def block_size(self):

        if not self.is_dxt():

            return 1

        return 4

    def bytes_per_block(self) -> Literal[1, 8, 16]:

        if not self.is_dxt():

            return 1

        return 8 if self is TPCTextureFormat.DXT1 else 16

    def bytes_per_pixel(self) -> Literal[1, 4, 3, 0]:

        bytes_per_pixel = 0

        if self is self.__class__.Greyscale:

            bytes_per_pixel = 1

        elif self.is_dxt():

            bytes_per_pixel = 1  # technically incorrect, but typically the result the application needs to know.

        elif self in (self.__class__.RGB, self.__class__.BGR):

            bytes_per_pixel = 3

        elif self in (self.__class__.RGBA, self.__class__.BGRA):

            bytes_per_pixel = 4

        return bytes_per_pixel

    def is_dxt(self) -> bool:

        return self in (

            self.__class__.DXT1,

            self.__class__.DXT3,

            self.__class__.DXT5,

        )

    def min_size(self) -> Literal[0, 1, 3, 4, 8, 16]:

        min_size = 0

        if self is self.__class__.Greyscale:

            min_size = 1

        elif self in (self.__class__.RGB, self.__class__.BGR):

            min_size = 3

        elif self in (self.__class__.RGBA, self.__class__.BGRA):

            min_size = 4

        elif self.is_dxt():

            min_size = self.bytes_per_block()

        return min_size

    def get_size(

        self,

        width: int,

        height: int,

    ) -> int:

        size = 0

        if self.is_dxt():

            bytes_per_block = self.bytes_per_block()

            size = max(bytes_per_block, ((width + 3) // 4) * ((height + 3) // 4) * bytes_per_block)

        else:

            size = width * height * self.bytes_per_pixel()

        return size

    def to_qimage_format(self) -> QImage.Format:

        from qtpy.QtGui import QImage

        q_format = QImage.Format.Format_Invalid

        if self is self.__class__.Greyscale:

            q_format = QImage.Format.Format_Grayscale8

        elif self is self.__class__.RGB:

            q_format = QImage.Format.Format_RGB888

        elif self is self.__class__.BGRA:

            q_format = QImage.Format.Format_BGR888

        elif self is self.__class__.RGBA:

            q_format = QImage.Format.Format_RGBA8888

        elif self is self.__class__.BGRA:

            q_format = QImage.Format.Format_ARGB32

        return q_format

    @classmethod

    def from_qimage_format(cls, qimage_format: QImage.Format) -> Self:

        from qtpy.QtGui import QImage

        fmt = cls.Invalid

        if qimage_format == QImage.Format.Format_Grayscale8:

            fmt = cls.Greyscale

        if qimage_format == QImage.Format.Format_RGB888:

            fmt = cls.RGB

        if qimage_format == QImage.Format.Format_RGBA8888:

            fmt = cls.RGBA

        return fmt  # type: ignore[return-value]

    def to_pil_mode(self) -> str:

        mode = \"\"

        if self is self.__class__.Greyscale:

            mode = \"L\"

        elif self is self.__class__.RGB:

            mode = \"RGB\"

        elif self is self.__class__.RGBA:

            mode = \"RGBA\"

        return mode

    @classmethod

    def from_pil_mode(cls, mode: Literal[\"L\", \"RGB\", \"RGBA\"]) -> Self:

        fmt = cls.Invalid

        if mode == \"L\":

            fmt = cls.Greyscale

        elif mode == \"RGB\":

            fmt = cls.RGB

        elif mode == \"RGBA\":

            fmt = cls.RGBA

        return fmt  # type: ignore[return-value]



@dataclass

class TPCMipmap:

    width: int

    height: int

    tpc_format: TPCTextureFormat

    data: bytearray

    @property

    def size(self) -> int:

        return len(self.data)

    def to_qicon(self) -> QIcon:

        from qtpy.QtGui import QIcon, QPixmap, QTransform

        pixmap: QPixmap = QPixmap.fromImage(self.to_qimage()).transformed(QTransform().scale(1, -1))

        return QIcon(pixmap)

    def to_qimage(self) -> QImage:

        from qtpy.QtGui import QImage

        return QImage(bytes(self.data), self.width, self.height, self.tpc_format.to_qimage_format())

    def to_pil_image(self) -> Image.Image:

        from PIL import Image

        return Image.frombytes(self.tpc_format.to_pil_mode(), (self.width, self.height), self.data)

@dataclass

class TPCLayer:

    mipmaps: list[TPCMipmap] = field(default_factory=list)

class TPC:

    BINARY_TYPE = ResourceType.TPC

    BLANK_LAYER = TPCLayer(

        [

            TPCMipmap(

                width,

                height,

                TPCTextureFormat.RGBA,

                bytearray(0 for _ in range(width * height * 4)),

            )

            for width, height in [(256, 256), (128, 128), (64, 64), (32, 32), (16, 16), (8, 8), (4, 4), (2, 2), (1, 1)]

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

        instance = cls()

        instance.layers = [cls.BLANK_LAYER]

        instance._format = TPCTextureFormat.RGBA  # noqa: SLF001

        return instance

    @property

    def txi(self) -> str:

        return str(self._txi)

    @txi.setter

    def txi(self, value: str):

        self._txi.load(value)

    def format(self) -> TPCTextureFormat:

        return self._format

    def is_compressed(self) -> bool:

        return self._format in {TPCTextureFormat.DXT1, TPCTextureFormat.DXT3, TPCTextureFormat.DXT5}

    def mipmap_size(self, layer: int, mipmap: int) -> tuple[int, int]:

        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]

        return mm.width, mm.height

    def dimensions(self) -> tuple[int, int]:

        if not self.layers:

            return 0, 0

        return self.layers[0].mipmaps[0].width, self.layers[0].mipmaps[0].height

    def get(self, layer: int, mipmap: int) -> tuple[int, int, TPCTextureFormat, bytearray | None]:

        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]

        return mm.width, mm.height, mm.tpc_format, mm.data

```

In this code I am attempting to handle the TPC texture format for a 3d game. I would like to implement a `convert` function.



In your opinion, should this `convert` function be mutable (modify the TPC object directly), or immutable (return a new TPC object)? Why or why not? Provide a high-level analysis including existing mipmap implementations and whether existing editor applications would use mutable or immutable data structures. Performance of the application is important."
extracted_at: "2026-06-29T16:22:15.511Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# ```

from __future__ import annotations

from dataclasses import dataclass, field

from enum import IntEnum, auto

from typing import TYPE_CHECKING

from pykotor.resource.formats.tpc.bgra_conversions import bgra_to_grey, bgra_to_rgb, bgra_to_rgba, rgba_to_bgra  # noqa: F401

from pykotor.resource.formats.tpc.dxt_conversions import dxt1_to_rgb, dxt5_to_rgba, rgb_to_dxt1, rgba_to_dxt5  # noqa: F401

from pykotor.resource.formats.tpc.greyscale_conversions import grey_to_rgb, grey_to_rgba, rgb_to_grey, rgba_to_grey  # noqa: F401

from pykotor.resource.formats.tpc.rgb_conversions import rgb_to_rgba, rgba_to_rgb  # noqa: F401

from pykotor.resource.formats.txi.txi_data import TXI

from pykotor.resource.type import ResourceType

if TYPE_CHECKING:

    from PIL import Image

    from qtpy.QtGui import QIcon, QImage, QPixmap

    from typing_extensions import Literal, Self



class TPCTextureFormat(IntEnum):

    Invalid = -1

    Greyscale = 0

    DXT1 = auto()

    DXT3 = auto()

    DXT5 = auto()

    RGB = auto()

    RGBA = auto()

    BGRA = auto()

    BGR = auto()

    def block_size(self):

        if not self.is_dxt():

            return 1

        return 4

    def bytes_per_block(self) -> Literal[1, 8, 16]:

        if not self.is_dxt():

            return 1

        return 8 if self is TPCTextureFormat.DXT1 else 16

    def bytes_per_pixel(self) -> Literal[1, 4, 3, 0]:

        bytes_per_pixel = 0

        if self is self.__class__.Greyscale:

            bytes_per_pixel = 1

        elif self.is_dxt():

            bytes_per_pixel = 1  # technically incorrect, but typically the result the application needs to know.

        elif self in (self.__class__.RGB, self.__class__.BGR):

            bytes_per_pixel = 3

        elif self in (self.__class__.RGBA, self.__class__.BGRA):

            bytes_per_pixel = 4

        return bytes_per_pixel

    def is_dxt(self) -> bool:

        return self in (

            self.__class__.DXT1,

            self.__class__.DXT3,

            self.__class__.DXT5,

        )

    def min_size(self) -> Literal[0, 1, 3, 4, 8, 16]:

        min_size = 0

        if self is self.__class__.Greyscale:

            min_size = 1

        elif self in (self.__class__.RGB, self.__class__.BGR):

            min_size = 3

        elif self in (self.__class__.RGBA, self.__class__.BGRA):

            min_size = 4

        elif self.is_dxt():

            min_size = self.bytes_per_block()

        return min_size

    def get_size(

        self,

        width: int,

        height: int,

    ) -> int:

        size = 0

        if self.is_dxt():

            bytes_per_block = self.bytes_per_block()

            size = max(bytes_per_block, ((width + 3) // 4) * ((height + 3) // 4) * bytes_per_block)

        else:

            size = width * height * self.bytes_per_pixel()

        return size

    def to_qimage_format(self) -> QImage.Format:

        from qtpy.QtGui import QImage

        q_format = QImage.Format.Format_Invalid

        if self is self.__class__.Greyscale:

            q_format = QImage.Format.Format_Grayscale8

        elif self is self.__class__.RGB:

            q_format = QImage.Format.Format_RGB888

        elif self is self.__class__.BGRA:

            q_format = QImage.Format.Format_BGR888

        elif self is self.__class__.RGBA:

            q_format = QImage.Format.Format_RGBA8888

        elif self is self.__class__.BGRA:

            q_format = QImage.Format.Format_ARGB32

        return q_format

    @classmethod

    def from_qimage_format(cls, qimage_format: QImage.Format) -> Self:

        from qtpy.QtGui import QImage

        fmt = cls.Invalid

        if qimage_format == QImage.Format.Format_Grayscale8:

            fmt = cls.Greyscale

        if qimage_format == QImage.Format.Format_RGB888:

            fmt = cls.RGB

        if qimage_format == QImage.Format.Format_RGBA8888:

            fmt = cls.RGBA

        return fmt  # type: ignore[return-value]

    def to_pil_mode(self) -> str:

        mode = ""

        if self is self.__class__.Greyscale:

            mode = "L"

        elif self is self.__class__.RGB:

            mode = "RGB"

        elif self is self.__class__.RGBA:

            mode = "RGBA"

        return mode

    @classmethod

    def from_pil_mode(cls, mode: Literal["L", "RGB", "RGBA"]) -> Self:

        fmt = cls.Invalid

        if mode == "L":

            fmt = cls.Greyscale

        elif mode == "RGB":

            fmt = cls.RGB

        elif mode == "RGBA":

            fmt = cls.RGBA

        return fmt  # type: ignore[return-value]



@dataclass

class TPCMipmap:

    width: int

    height: int

    tpc_format: TPCTextureFormat

    data: bytearray

    @property

    def size(self) -> int:

        return len(self.data)

    def to_qicon(self) -> QIcon:

        from qtpy.QtGui import QIcon, QPixmap, QTransform

        pixmap: QPixmap = QPixmap.fromImage(self.to_qimage()).transformed(QTransform().scale(1, -1))

        return QIcon(pixmap)

    def to_qimage(self) -> QImage:

        from qtpy.QtGui import QImage

        return QImage(bytes(self.data), self.width, self.height, self.tpc_format.to_qimage_format())

    def to_pil_image(self) -> Image.Image:

        from PIL import Image

        return Image.frombytes(self.tpc_format.to_pil_mode(), (self.width, self.height), self.data)

@dataclass

class TPCLayer:

    mipmaps: list[TPCMipmap] = field(default_factory=list)

class TPC:

    BINARY_TYPE = ResourceType.TPC

    BLANK_LAYER = TPCLayer(

        [

            TPCMipmap(

                width,

                height,

                TPCTextureFormat.RGBA,

                bytearray(0 for _ in range(width * height * 4)),

            )

            for width, height in [(256, 256), (128, 128), (64, 64), (32, 32), (16, 16), (8, 8), (4, 4), (2, 2), (1, 1)]

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

        instance = cls()

        instance.layers = [cls.BLANK_LAYER]

        instance._format = TPCTextureFormat.RGBA  # noqa: SLF001

        return instance

    @property

    def txi(self) -> str:

        return str(self._txi)

    @txi.setter

    def txi(self, value: str):

        self._txi.load(value)

    def format(self) -> TPCTextureFormat:

        return self._format

    def is_compressed(self) -> bool:

        return self._format in {TPCTextureFormat.DXT1, TPCTextureFormat.DXT3, TPCTextureFormat.DXT5}

    def mipmap_size(self, layer: int, mipmap: int) -> tuple[int, int]:

        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]

        return mm.width, mm.height

    def dimensions(self) -> tuple[int, int]:

        if not self.layers:

            return 0, 0

        return self.layers[0].mipmaps[0].width, self.layers[0].mipmaps[0].height

    def get(self, layer: int, mipmap: int) -> tuple[int, int, TPCTextureFormat, bytearray | None]:

        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]

        return mm.width, mm.height, mm.tpc_format, mm.data

```

In this code I am attempting to handle the TPC texture format for a 3d game. I would like to implement a `convert` function.



In your opinion, should this `convert` function be mutable (modify the TPC object directly), or immutable (return a new TPC object)? Why or why not? Provide a high-level analysis including existing mipmap implementations and whether existing editor applications would use mutable or immutable data structures. Performance of the application is important.

Source: [Perplexity thread](https://www.perplexity.ai/search/4cb21890-5b07-4486-9ca7-26f28f7abdd9)

## User

```

from __future__ import annotations

from dataclasses import dataclass, field

from enum import IntEnum, auto

from typing import TYPE_CHECKING

from pykotor.resource.formats.tpc.bgra_conversions import bgra_to_grey, bgra_to_rgb, bgra_to_rgba, rgba_to_bgra  # noqa: F401

from pykotor.resource.formats.tpc.dxt_conversions import dxt1_to_rgb, dxt5_to_rgba, rgb_to_dxt1, rgba_to_dxt5  # noqa: F401

from pykotor.resource.formats.tpc.greyscale_conversions import grey_to_rgb, grey_to_rgba, rgb_to_grey, rgba_to_grey  # noqa: F401

from pykotor.resource.formats.tpc.rgb_conversions import rgb_to_rgba, rgba_to_rgb  # noqa: F401

from pykotor.resource.formats.txi.txi_data import TXI

from pykotor.resource.type import ResourceType

if TYPE_CHECKING:

    from PIL import Image

    from qtpy.QtGui import QIcon, QImage, QPixmap

    from typing_extensions import Literal, Self



class TPCTextureFormat(IntEnum):

    Invalid = -1

    Greyscale = 0

    DXT1 = auto()

    DXT3 = auto()

    DXT5 = auto()

    RGB = auto()

    RGBA = auto()

    BGRA = auto()

    BGR = auto()

    def block_size(self):

        if not self.is_dxt():

            return 1

        return 4

    def bytes_per_block(self) -> Literal[1, 8, 16]:

        if not self.is_dxt():

            return 1

        return 8 if self is TPCTextureFormat.DXT1 else 16

    def bytes_per_pixel(self) -> Literal[1, 4, 3, 0]:

        bytes_per_pixel = 0

        if self is self.__class__.Greyscale:

            bytes_per_pixel = 1

        elif self.is_dxt():

            bytes_per_pixel = 1  # technically incorrect, but typically the result the application needs to know.

        elif self in (self.__class__.RGB, self.__class__.BGR):

            bytes_per_pixel = 3

        elif self in (self.__class__.RGBA, self.__class__.BGRA):

            bytes_per_pixel = 4

        return bytes_per_pixel

    def is_dxt(self) -> bool:

        return self in (

            self.__class__.DXT1,

            self.__class__.DXT3,

            self.__class__.DXT5,

        )

    def min_size(self) -> Literal[0, 1, 3, 4, 8, 16]:

        min_size = 0

        if self is self.__class__.Greyscale:

            min_size = 1

        elif self in (self.__class__.RGB, self.__class__.BGR):

            min_size = 3

        elif self in (self.__class__.RGBA, self.__class__.BGRA):

            min_size = 4

        elif self.is_dxt():

            min_size = self.bytes_per_block()

        return min_size

    def get_size(

        self,

        width: int,

        height: int,

    ) -> int:

        size = 0

        if self.is_dxt():

            bytes_per_block = self.bytes_per_block()

            size = max(bytes_per_block, ((width + 3) // 4) * ((height + 3) // 4) * bytes_per_block)

        else:

            size = width * height * self.bytes_per_pixel()

        return size

    def to_qimage_format(self) -> QImage.Format:

        from qtpy.QtGui import QImage

        q_format = QImage.Format.Format_Invalid

        if self is self.__class__.Greyscale:

            q_format = QImage.Format.Format_Grayscale8

        elif self is self.__class__.RGB:

            q_format = QImage.Format.Format_RGB888

        elif self is self.__class__.BGRA:

            q_format = QImage.Format.Format_BGR888

        elif self is self.__class__.RGBA:

            q_format = QImage.Format.Format_RGBA8888

        elif self is self.__class__.BGRA:

            q_format = QImage.Format.Format_ARGB32

        return q_format

    @classmethod

    def from_qimage_format(cls, qimage_format: QImage.Format) -> Self:

        from qtpy.QtGui import QImage

        fmt = cls.Invalid

        if qimage_format == QImage.Format.Format_Grayscale8:

            fmt = cls.Greyscale

        if qimage_format == QImage.Format.Format_RGB888:

            fmt = cls.RGB

        if qimage_format == QImage.Format.Format_RGBA8888:

            fmt = cls.RGBA

        return fmt  # type: ignore[return-value]

    def to_pil_mode(self) -> str:

        mode = ""

        if self is self.__class__.Greyscale:

            mode = "L"

        elif self is self.__class__.RGB:

            mode = "RGB"

        elif self is self.__class__.RGBA:

            mode = "RGBA"

        return mode

    @classmethod

    def from_pil_mode(cls, mode: Literal["L", "RGB", "RGBA"]) -> Self:

        fmt = cls.Invalid

        if mode == "L":

            fmt = cls.Greyscale

        elif mode == "RGB":

            fmt = cls.RGB

        elif mode == "RGBA":

            fmt = cls.RGBA

        return fmt  # type: ignore[return-value]



@dataclass

class TPCMipmap:

    width: int

    height: int

    tpc_format: TPCTextureFormat

    data: bytearray

    @property

    def size(self) -> int:

        return len(self.data)

    def to_qicon(self) -> QIcon:

        from qtpy.QtGui import QIcon, QPixmap, QTransform

        pixmap: QPixmap = QPixmap.fromImage(self.to_qimage()).transformed(QTransform().scale(1, -1))

        return QIcon(pixmap)

    def to_qimage(self) -> QImage:

        from qtpy.QtGui import QImage

        return QImage(bytes(self.data), self.width, self.height, self.tpc_format.to_qimage_format())

    def to_pil_image(self) -> Image.Image:

        from PIL import Image

        return Image.frombytes(self.tpc_format.to_pil_mode(), (self.width, self.height), self.data)

@dataclass

class TPCLayer:

    mipmaps: list[TPCMipmap] = field(default_factory=list)

class TPC:

    BINARY_TYPE = ResourceType.TPC

    BLANK_LAYER = TPCLayer(

        [

            TPCMipmap(

                width,

                height,

                TPCTextureFormat.RGBA,

                bytearray(0 for _ in range(width * height * 4)),

            )

            for width, height in [(256, 256), (128, 128), (64, 64), (32, 32), (16, 16), (8, 8), (4, 4), (2, 2), (1, 1)]

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

        instance = cls()

        instance.layers = [cls.BLANK_LAYER]

        instance._format = TPCTextureFormat.RGBA  # noqa: SLF001

        return instance

    @property

    def txi(self) -> str:

        return str(self._txi)

    @txi.setter

    def txi(self, value: str):

        self._txi.load(value)

    def format(self) -> TPCTextureFormat:

        return self._format

    def is_compressed(self) -> bool:

        return self._format in {TPCTextureFormat.DXT1, TPCTextureFormat.DXT3, TPCTextureFormat.DXT5}

    def mipmap_size(self, layer: int, mipmap: int) -> tuple[int, int]:

        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]

        return mm.width, mm.height

    def dimensions(self) -> tuple[int, int]:

        if not self.layers:

            return 0, 0

        return self.layers[0].mipmaps[0].width, self.layers[0].mipmaps[0].height

    def get(self, layer: int, mipmap: int) -> tuple[int, int, TPCTextureFormat, bytearray | None]:

        mm: TPCMipmap = self.layers[layer].mipmaps[mipmap]

        return mm.width, mm.height, mm.tpc_format, mm.data

```

In this code I am attempting to handle the TPC texture format for a 3d game. I would like to implement a `convert` function.



In your opinion, should this `convert` function be mutable (modify the TPC object directly), or immutable (return a new TPC object)? Why or why not? Provide a high-level analysis including existing mipmap implementations and whether existing editor applications would use mutable or immutable data structures. Performance of the application is important.

## Assistant

## Mutable vs. Immutable `convert` Function

When deciding whether the `convert` function should be mutable (modifying the existing `TPC` object) or immutable (returning a new `TPC` object), several factors must be considered, including performance, safety, and alignment with existing implementations.

### **Mutable Approach**

**Advantages:**
- **Performance Efficiency:** Modifying the existing object in place reduces memory overhead and avoids the need to create additional copies of the data. This is particularly beneficial when dealing with large textures and multiple mipmaps, as it minimizes both memory usage and processing time.
- **Consistency with Existing Mipmap Implementations:** Many mipmap implementations in game engines and graphics applications opt for mutable structures to allow for efficient updates and modifications. This approach aligns well with performance-critical applications where real-time adjustments are necessary.
- **Ease of Integration:** Mutable functions can seamlessly integrate with existing workflows and editor tools that expect in-place modifications, reducing the complexity of data handling.

**Disadvantages:**
- **Potential Side-Effects:** Mutating the original object can lead to unintended side-effects, especially if the object is shared across different parts of the application. This requires careful management to ensure data integrity.
- **Debugging Complexity:** Tracking changes to mutable objects can be more challenging, potentially complicating debugging and maintenance.

### **Immutable Approach**

**Advantages:**
- **Safety and Predictability:** Returning a new `TPC` object ensures that the original data remains unchanged, preventing accidental modifications and making the codebase easier to reason about.
- **Thread-Safety:** Immutable objects are inherently thread-safe, which can be advantageous in multi-threaded applications where concurrent access is common.
- **Simplified Debugging:** Since objects do not change state after creation, tracking the flow of data becomes more straightforward, simplifying the debugging process.

**Disadvantages:**
- **Increased Memory Usage:** Creating new objects for each conversion operation can lead to higher memory consumption, especially with large textures and numerous mipmaps.
- **Performance Overhead:** The additional memory allocations and data copying involved in immutable operations can negatively impact performance, which is a critical consideration for applications where efficiency is paramount.

### **Existing Editor Applications and Practices**

Most existing editor applications and game engines that handle textures and mipmaps prioritize performance due to the real-time nature of rendering and the large size of texture data. As a result, they typically employ mutable data structures to allow for efficient in-place modifications. This practice supports fast updates and reduces the computational load, which is essential for maintaining high performance in graphics-intensive applications.

### **Recommendation**

Considering the importance of performance in your application and the common practices in existing mipmap implementations and editor applications, a **mutable** `convert` function is advisable. This approach will allow you to efficiently manage and update texture data without the overhead of creating multiple object instances. However, it is crucial to implement proper safeguards to manage state changes and prevent unintended side-effects, such as using controlled access patterns or encapsulating mutable operations within well-defined interfaces.

## Implementation Considerations

If you choose to implement a mutable `convert` function, here are some considerations to ensure robustness and maintainability:

- **Encapsulation:** Encapsulate the conversion logic within the `TPC` class to control how and when modifications occur.
- **Validation:** Implement validation checks to ensure that conversions do not lead to inconsistent states or corrupted data.
- **Undo Mechanism:** If applicable, provide an undo mechanism to revert changes, enhancing the usability of the editor.
- **Thread Safety:** If your application is multi-threaded, ensure that modifications to the `TPC` object are thread-safe to prevent race conditions.

By carefully managing these aspects, you can leverage the performance benefits of a mutable approach while maintaining the integrity and reliability of your `TPC` texture handling.
