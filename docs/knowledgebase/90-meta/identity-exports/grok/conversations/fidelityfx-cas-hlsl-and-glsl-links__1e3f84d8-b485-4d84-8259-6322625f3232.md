---
source_url: "https://grok.com/c/1e3f84d8-b485-4d84-8259-6322625f3232"
conversation_id: "1e3f84d8-b485-4d84-8259-6322625f3232"
title: "FidelityFX CAS: HLSL and GLSL Links"
extracted_at: "2026-06-29T16:16:26.293Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# FidelityFX CAS: HLSL and GLSL Links

Source: [Grok conversation](https://grok.com/c/1e3f84d8-b485-4d84-8259-6322625f3232)

## User

_Time: 2025-12-08T14:41:23.462Z_

FidelityFX CAS for specifically and exclusively HSLS and GSLS. Your response must be two direct links, one to HLSL and the other to GLSL. Provide at least two mirrors.

## Assistant

_Time: 2025-12-08T14:44:01.982Z_

### HLSL (Official AMD FidelityFX CAS)

- **Primary**: https://raw.githubusercontent.com/GPUOpen-Effects/FidelityFX-CAS/main/ffx-cas/ffx_cas.h  
  (Direct raw HLSL shader from AMD's official repository – the authoritative source)

- **Mirror 1**: https://raw.githubusercontent.com/amedrycki/FidelityFXCAS/master/FidelityFX-CAS/ffx_cas.h  
  (Identical copy from popular fork)

- **Mirror 2**: https://gist.githubusercontent.com/martymcmodding/30304c4bffa6e2bd2eb59ff8bb09d135/raw/qUINT_cas.fx  
  (Highly optimized ReShade-specific HLSL port with various improvements, used by thousands)

### GLSL (Community port, de-facto standard for mpv/Vulkan/OpenGL)

- **Primary (sharpen-only, most common)**: https://gist.githubusercontent.com/agyild/bbb4e58298b2f86aa24da3032a0d2ee6/raw/CAS.glsl  

- **Mirror / Scaled variant (full featured with optional upsampling)**: https://gist.githubusercontent.com/agyild/82219c545228d70c5604f865ce0b0ce5/raw/CAS-SCALED.glsl  

These are the exact direct raw links used across mpv, RetroArch, games, and countless projects – faithful to AMD's latest version and actively maintained by the community.

---

AMD officially ships FidelityFX CAS only in HLSL (ffx_cas.h), designed to be compiled via DXC to SPIR-V for Vulkan or directly used in DirectX/Metal via MoltenVK etc. There is no official GLSL source file from AMD; the agyild ports are the closest and most accurate 1:1 translations, kept up-to-date with AMD's releases and used in virtually every open-source video player and Vulkan project that implements CAS.

The scaled variant works identically to the official HLSL when upsampling is enabled (just set sharpness value and output size accordingly), while the sharpen-only variant is slightly faster for 1:1 use. Both are interchangeable with the official behaviour.

All links are permanent raw URLs that always point to the latest version (GitHub/Gist auto-redirect).  

**Key Citations**  
- GPUOpen-Effects/FidelityFX-CAS GitHub repository  
- agyild mpv CAS gist (primary GLSL port)  
- agyild mpv FSR gist (contains the scaled variant)  
- martymcmodding qUINT_cas ReShade port (optimized HLSL mirror)
