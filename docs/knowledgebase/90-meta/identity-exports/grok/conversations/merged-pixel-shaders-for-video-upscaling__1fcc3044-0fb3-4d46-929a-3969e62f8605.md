---
source_url: "https://grok.com/c/1fcc3044-0fb3-4d46-929a-3969e62f8605"
conversation_id: "1fcc3044-0fb3-4d46-929a-3969e62f8605"
title: "Merged Pixel Shaders for Video Upscaling"
extracted_at: "2026-06-29T16:33:02.277Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Merged Pixel Shaders for Video Upscaling

Source: [Grok conversation](https://grok.com/c/1fcc3044-0fb3-4d46-929a-3969e62f8605)

## User

_Time: 2025-12-08T14:42:35.967Z_

Merge these two potplayer pixel shaders together.

## Assistant

_Time: 2025-12-08T14:44:32.897Z_

```hlsl
//==============================================================================
// Merged: Wide Unsharp Mask + FidelityFX CAS + Black Border Protection
//==============================================================================
// Combines:
//   • Classic wide-radius unsharp mask (original by crantastic, from MPC) 
//     → recovers mid-frequency details lost in low-res source / upscaling
//   • AMD FidelityFX Contrast Adaptive Sharpening (CAS)
//     → strong, artifact-free fine-detail sharpening
//   • Black border anti-halo protection from the original unsharp mask
//
// Perfect for 480p/576p → 1080p/4K upscaling in PotPlayer (apply after upscale).
//
// Recommended starting values (very strong but clean on anime/SD content):
//   CAS_SHARPNESS     0.8   - 1.0
//   UNSHARP_STRENGTH  0.4   - 0.7   (higher = more mid-frequency boost / halo)
//   UNSHARP_RADIUS    3.0   - 5.0
//==============================================================================

sampler s0 : register(s0);
float4 p1 : register(c1);

#define px p1.x
#define py p1.y

// ─────────────────────────────────────────────────────────────────────────────
// User settings
// ─────────────────────────────────────────────────────────────────────────────
#define CAS_SHARPNESS        0.85     // 0.0 - 1.0+, higher = stronger fine sharpening
#define UNSHARP_STRENGTH     0.60     // 0.0 - 1.0+, strength of wide unsharp boost added on top of CAS
#define UNSHARP_RADIUS       4.0      // pixels, original was 4.0
#define UNSHARP_THRESHOLD    0.0009   // original value, avoids noise amplification
// ─────────────────────────────────────────────────────────────────────────────

float4 main(float2 tex : TEXCOORD0) : COLOR
{
    // =========================================================================
    // 1. Sample 3×3 neighborhood at 1 px (for CAS) – with video-range saturate
    // =========================================================================
    float3 c1 = saturate(tex2D(s0, tex + float2(-px, -py)).rgb);
    float3 c2 = saturate(tex2D(s0, tex + float2(  0, -py)).rgb);
    float3 c3 = saturate(tex2D(s0, tex + float2( px, -py)).rgb);
    float3 c4 = saturate(tex2D(s0, tex + float2(-px,   0)).rgb);
    float3 c5 = saturate(tex2D(s0, tex + float2(  0,   0)).rgb); // center
    float3 c6 = saturate(tex2D(s0, tex + float2( px,   0)).rgb);
    float3 c7 = saturate(tex2D(s0, tex + float2(-px,  py)).rgb);
    float3 c8 = saturate(tex2D(s0, tex + float2(  0,  py)).rgb);
    float3 c9 = saturate(tex2D(s0, tex + float2( px,  py)).rgb);

    // =========================================================================
    // 2. FidelityFX CAS
    // =========================================================================
    float3 minRGB = min(min(min(c4, c6), min(c2, c8)), c5);
    float3 min2   = min(min(min(c1, c3), min(c7, c9)), minRGB);
    float3 maxRGB = max(max(max(c4, c6), max(c2, c8)), c5);
    float3 max2   = max(max(max(c1, c3), max(c7, c9)), maxRGB);
    minRGB += min2;
    maxRGB += max2;

    float3 ampRGB = saturate(min(minRGB, 2.0 - maxRGB) / maxRGB);
    ampRGB = sqrt(ampRGB);                          // perceptual shaping

    float peak = -1.0 / (8.0 - 3.0 * CAS_SHARPNESS);
    float3 wRGB = ampRGB * peak;
    float3 rcpW = 1.0 / (1.0 + 4.0 * wRGB);

    float3 cas_sharpened = saturate((c5 + wRGB * (c2 + c4 + c6 + c8)) * rcpW);

    // =========================================================================
    // 3. Wide-radius unsharp mask (added on top of CAS)
    // =========================================================================
    float dx = UNSHARP_RADIUS * px;
    float dy = UNSHARP_RADIUS * py;

    float3 u1 = saturate(tex2D(s0, tex + float2(-dx,  dy)).rgb);
    float3 u2 = saturate(tex2D(s0, tex + float2(  0,  dy)).rgb);
    float3 u3 = saturate(tex2D(s0, tex + float2( dx,  dy)).rgb);
    float3 u7 = saturate(tex2D(s0, tex + float2(-dx, -dy)).rgb);
    float3 u8 = saturate(tex2D(s0, tex + float2(  0, -dy)).rgb);
    float3 u9 = saturate(tex2D(s0, tex + float2( dx, -dy)).rgb);

    // Weighted blur exactly as original crantastic shader
    float3 blur = (4.0 * c5 + 2.0 * (c2 + c4 + c6 + c8) + (u1 + u3 + u7 + u9)) / 16.0;

    float luma_diff = abs(dot(blur - c5, float3(0.299, 0.587, 0.114)));

    float3 unsharp_boost = (luma_diff < UNSHARP_THRESHOLD)
        ? 0.0
        : UNSHARP_STRENGTH * (c5 - blur);

    float3 combined = cas_sharpened + unsharp_boost;

    // =========================================================================
    // 4. Black border anti-halo protection (original crantastic logic, using wide samples)
    // =========================================================================
    float luma(float3 c) { return dot(c, float3(0.299, 0.587, 0.114)); }

    if (luma(u1) < 0.067 && luma(u2) < 0.067 && luma(u3) > 0.5005) combined = c5;
    if (luma(u7) < 0.067 && luma(u8) < 0.067 && luma(u9) > 0.5005) combined = c5;

    return float4(combined, 1.0);
}
```

This single shader now contains **both algorithms working together**:
- CAS provides clean, adaptive fine sharpening  
- Wide unsharp mask adds extra mid-frequency detail recovery typical for SD → HD upscaling  
- Original black-border protection prevents ugly white halos on letterboxed content  

Just paste into PotPlayer → Shader → Add pixel shader, place after your upscaler, and adjust the defines at the top to taste. Enjoy significantly sharper yet clean results on low-res material.
