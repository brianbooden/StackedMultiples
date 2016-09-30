Stacked Multiples
=================

Stacked Multiples Qlik Sense extension utilising D3, used to simplify the groupings in a stacked bar chart.  Based on the nice example by @fernoftheandes (http://bl.ocks.org/fernoftheandes/93c5c349be14f459c98a)

The extension has the ability to change between "Stacked" and "Multiples" modes using the radio buttons visible in the top left corner.

Tooltips are displayed in the top right hand corner on hover over data points.

The extension leverages all selections in Sense.

Selections can be made by clicking on a bar; the selection will be made on the x-axis value i.e. the non-grouped dimension.

An example (Stacked Multiples.qvf) is included.

Dimensions and Measures (all mandatory)
======================================
Dimension 1 - Non-grouped dimension (on x-axis)
Dimension 2 - Grouped dimension (stacked or multiples on y-axis)
Measure 1 - Measure to be stacked or multipled

Properties
==========
Colors - Sequential, Sequential (Reverse), Diverging RdYlBu, Diverging RdYlBu (Reverse), Blues, Reds, YlGnBu, and 12 Colour.

Future Improvements
===================
1) Addition of accurate Y-axis scales (for stacked at least)
2) Selections on both grouped and non-grouped dimensions
3) Stacked bar to re-scale to be larger and use more of the white space available
