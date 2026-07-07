---
source_url: "https://www.perplexity.ai/search/85857c30-3cb9-4744-bbdb-c9048ca5b349"
thread_uuid: "a65bc205-20b7-4687-8322-fd48721c16c9"
slug: "85857c30-3cb9-4744-bbdb-c9048ca5b349"
title: "```
from enum import auto, IntEnum

class TPCTextureFormat(IntEnum):
    Invalid = -1
    Greyscale = 0
    DXT1 = auto()
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
            bytes_per_pixel = 1  # technically incorrect, but typically the result the application needs to know.
        elif self in (self.__class__.RGB, self.__class__.BGR):
            bytes_per_pixel = 3
        elif self in (self.__class__.RGBA, self.__class__.BGRA):
            bytes_per_pixel = 4
        return bytes_per_pixel

    def is_dxt(self) -> bool:
        return self in (
            self.__class__.DXT1,
            self.__class__.DXT5,
        ) or self.name.startswith(\"DXT\")

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
```

Determine the accuracy of the above code with what you can research on the DXT1/DXT5 formats and RGB/RGBA formats."
extracted_at: "2026-06-29T16:36:13.721Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# ```
from enum import auto, IntEnum

class TPCTextureFormat(IntEnum):
    Invalid = -1
    Greyscale = 0
    DXT1 = auto()
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
            bytes_per_pixel = 1  # technically incorrect, but typically the result the application needs to know.
        elif self in (self.__class__.RGB, self.__class__.BGR):
            bytes_per_pixel = 3
        elif self in (self.__class__.RGBA, self.__class__.BGRA):
            bytes_per_pixel = 4
        return bytes_per_pixel

    def is_dxt(self) -> bool:
        return self in (
            self.__class__.DXT1,
            self.__class__.DXT5,
        ) or self.name.startswith("DXT")

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
```

Determine the accuracy of the above code with what you can research on the DXT1/DXT5 formats and RGB/RGBA formats.

Source: [Perplexity thread](https://www.perplexity.ai/search/85857c30-3cb9-4744-bbdb-c9048ca5b349)

## User

```
from enum import auto, IntEnum

class TPCTextureFormat(IntEnum):
    Invalid = -1
    Greyscale = 0
    DXT1 = auto()
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
            bytes_per_pixel = 1  # technically incorrect, but typically the result the application needs to know.
        elif self in (self.__class__.RGB, self.__class__.BGR):
            bytes_per_pixel = 3
        elif self in (self.__class__.RGBA, self.__class__.BGRA):
            bytes_per_pixel = 4
        return bytes_per_pixel

    def is_dxt(self) -> bool:
        return self in (
            self.__class__.DXT1,
            self.__class__.DXT5,
        ) or self.name.startswith("DXT")

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
```

Determine the accuracy of the above code with what you can research on the DXT1/DXT5 formats and RGB/RGBA formats.

## Assistant

_(No answer text in API response)_
