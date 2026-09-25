import { createPortal } from "react-dom";
import type { CSSProperties } from "react";

import { isPreviewBelow } from "./partnerPreviewLayout";
import { formatPartnerLink } from "./partners";
import type { Partner } from "./partners";

import "./PartnerPreview.scss";

type PartnerPreviewProps = {
  partner: Partner;
  anchor: DOMRect;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onOpen: () => void;
};

const CARD_WIDTH = 248;
const GAP = 14;
const VIEWPORT_MARGIN = 8;

// Kartica na desktopu pri prelasku mišem preko loga partnera. Ide u portal jer
// marquee ima overflow: hidden i odsekao bi je. Klikabilan je samo link u njoj,
// da slučajan klik po kartici ne otvori stranicu. Link je samo za miš (za
// tastaturu i čitače ekrana link je logo), pa je kartica aria-hidden.
const PartnerPreview = ({
  partner,
  anchor,
  onPointerEnter,
  onPointerLeave,
  onOpen,
}: PartnerPreviewProps) => {
  const centerX = anchor.left + anchor.width / 2;
  const left = Math.min(
    Math.max(centerX - CARD_WIDTH / 2, VIEWPORT_MARGIN),
    window.innerWidth - CARD_WIDTH - VIEWPORT_MARGIN,
  );
  const placeBelow = isPreviewBelow(anchor);
  const style: CSSProperties = placeBelow
    ? { left, top: anchor.bottom + GAP }
    : { left, top: anchor.top - GAP, transform: "translateY(-100%)" };

  return createPortal(
    <div
      className={`partner-preview${placeBelow ? " partner-preview--below" : ""}`}
      style={style}
      aria-hidden="true"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="partner-preview-logo">
        <img
          className="partner-preview-logo-img"
          src={partner.src}
          alt=""
          style={
            {
              "--logo-crop": partner.crop,
              "--logo-scale": partner.scale,
            } as CSSProperties
          }
        />
      </div>

      <div className="partner-preview-body">
        <span className="partner-preview-kind">
          {partner.kind === "robni" ? "ROBNI" : "NATURALNI"}
        </span>
        <strong className="partner-preview-name">{partner.name}</strong>
        <a
          className="partner-preview-anchor"
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          draggable={false}
          onClick={onOpen}
        >
          <span className="partner-preview-link">
            {formatPartnerLink(partner.url)}
          </span>
          <span className="partner-preview-open">Otvori ↗</span>
        </a>
      </div>
    </div>,
    document.body,
  );
};

export default PartnerPreview;
