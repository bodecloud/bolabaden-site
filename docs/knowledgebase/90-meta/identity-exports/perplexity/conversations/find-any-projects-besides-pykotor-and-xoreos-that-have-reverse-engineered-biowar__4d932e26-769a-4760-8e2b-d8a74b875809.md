---
source_url: "https://www.perplexity.ai/search/53fdda71-5bd9-41c3-b8f7-68d6643ff7e9"
thread_uuid: "4d932e26-769a-4760-8e2b-d8a74b875809"
slug: "53fdda71-5bd9-41c3-b8f7-68d6643ff7e9"
title: "Find any projects besides PyKotor and Xoreos that have reverse engineered Bioware's TPC texture format."
extracted_at: "2026-06-29T16:22:12.843Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Find any projects besides PyKotor and Xoreos that have reverse engineered Bioware's TPC texture format.

Source: [Perplexity thread](https://www.perplexity.ai/search/53fdda71-5bd9-41c3-b8f7-68d6643ff7e9)

## User

Find any projects besides PyKotor and Xoreos that have reverse engineered Bioware's TPC texture format.

## Assistant

Based on the search results provided, there do not appear to be any other projects besides PyKotor and Xoreos that have reverse engineered Bioware's TPC texture format. The search results primarily focus on Xoreos and its related tools for working with various Bioware file formats, including TPC textures. 

However, we can provide some additional information about the TPC format and how it's handled in existing projects:

## TPC Format in Xoreos

Xoreos and its associated tools have implemented support for working with TPC (Texture Packed) files. Some key points about their TPC handling include:[1][2]

- The xoreostex2tga tool can convert Bioware's texture formats, including TPC, into TGA images.[2]
- TPC files can contain animated textures and swizzled Xbox SBM (Static Bump Map) images.[3]

## TPC Format Details

Based on the code snippet provided, we can glean some information about the TPC file structure:[1]

- The TPC header contains fields for data size, reserved space, x and y dimensions, and encoding type.
- The format supports various pixel encodings, including DXT1 compression.
- Color data is typically stored in BGR or RGB format, requiring conversion for standard image output.

## Other Bioware File Format Tools

While not specifically focused on TPC files, Xoreos-tools includes a variety of utilities for working with Bioware's file formats:[2]

- gff2xml and xml2gff for converting between GFF and XML formats
- tlk2xml and xml2tlk for TLK (talk table) files
- unerf, unherf, and unrim for extracting various Bioware archive formats

These tools demonstrate the broader effort to reverse engineer and work with Bioware's proprietary file formats used in their games.

In conclusion, while PyKotor and Xoreos remain the primary known projects for handling TPC files, the ongoing work in the Xoreos project continues to improve support for Bioware's file formats, including TPC textures.

### Sources

- [KotOR-Bioware-Libs/TPC.pm at main - GitHub](https://github.com/Fair-Strides/KotOR-Bioware-Libs/blob/main/TPC.pm)
  - #u16 ysize PACKED; //11-12 #u8 encoding PACKED; //13 #u8 dummy PACKED; //14-128 $self->{tpc} = {}; $self->{tga} = {}; my ($hdr_data_size,$hdr_reserved,$hdr_xsize,$hdr_ysize,$hdr_encoding)=unpack('VVvvC',$tpc_header_packed); $self->{tpc}{header}{data_size}=$hdr_data_size; $self->{tpc}{header}{reserved}=$hdr_reserved; $self->{tpc}{header}{xsize}=$hdr_xsize; $self->{tpc}{header}{ysize}=$hdr_ysize; $self->{tpc}{header}{encoding}=$hdr_encoding; my @pixels;... # return $color & 0xFF00FF00...
- [Tools to help the development of xoreos - GitHub](https://github.com/xoreos/xoreos-tools)
  - A collection of tools to help with the reverse-engineering of BioWare's Aurora engine games. xoreos-tools is part of the xoreos project; please see the xoreos website and its GitHub repositories for details, especially the main README.md. The tools included here are licensed under the terms of the GNU General Public License version 3 or (at your option) any later version. Currently, the following tools are included:... - gff2xml: Convert BioWare GFF to XML tlk2xml: Convert BioWare TLK to XML...
- [xoreos](https://xoreos.org)
  - Phaethon already required a C++14-capable compiler the last release; this has not changed. This leads us to the news in xoreos-tools: the xoreos-tools package has gained nine new tools, most of them thanks to Nostritius. These tools are: unobb, untws, rim, keybif, tws, fixnwn2xml, xml2gff, fev2xml and ncsdecomp. The first two new tools, unobb and untws, are new archive unpackers. unobb extracts “obb” files found in Aspyr’s Android and iOS ports of the BioWare games, which can be either plain...
- [Topic - xoreos - Reimplementing BioWare's 3D games • Project ...](https://forum.freegamedev.net/viewtopic.php?f=22&start=0&t=6144)
