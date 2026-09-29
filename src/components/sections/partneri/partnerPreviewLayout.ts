export const HOVER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

// Približna visina kartice; ako iznad loga nema toliko mesta, kartica ide ispod.
const CARD_MIN_SPACE_ABOVE = 250;

export const isPreviewBelow = (anchor: DOMRect) =>
  anchor.top < CARD_MIN_SPACE_ABOVE;

// Da li je miš napustio logo na strani na kojoj je kartica (gore ili dole).
export const isLeavingTowardPreview = (
  anchor: DOMRect,
  clientY: number,
) =>
  isPreviewBelow(anchor)
    ? clientY >= anchor.bottom - 2
    : clientY <= anchor.top + 2;
