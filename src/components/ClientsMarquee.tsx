import Image from "next/image";

const CLIENTS = [
  { name: "Al Ayoon",          svg: "/assets/clients/al-ayoon.svg" },
  { name: "Al Sharqi",         svg: "/assets/clients/al-sharqi.svg" },
  { name: "British Polishing", svg: "/assets/clients/british-polishing.svg" },
  { name: "Desert Drive",      svg: "/assets/clients/desert-drive.svg" },
  { name: "Falcon Auto Care",  svg: "/assets/clients/falcon-auto-care.svg" },
  { name: "Gulf Motor Works",  svg: "/assets/clients/gulf-motor-works.svg" },
  { name: "Liwa Car & Tyre",   svg: "/assets/clients/liwa-car-tyre-service.svg" },
  { name: "Zubara Detailing",  svg: "/assets/clients/zubara-detailing.svg" },
];

export function ClientsMarquee() {
  return (
    <div className="md:sticky" style={{ top: 0, zIndex: 1 }}>
      <section style={{ position: "relative", background: "#0a0a0a", paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ paddingLeft: "26px", paddingRight: "26px" }}>

          {/* ── Desktop layout: label left + 4-col grid right ── */}
          <div className="hidden md:flex" style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            columnGap: "16px",
          }}>
            <div style={{ flex: 1, paddingTop: "52px" }}>
              <p style={{
                margin: 0,
                fontSize: "17.75px",
                lineHeight: 1.35,
                color: "rgb(232, 232, 227)",
                fontWeight: 500,
                maxWidth: "234px",
              }}>
                Clients whose realities we&apos;ve changed
              </p>
            </div>

            <div style={{
              flexShrink: 0,
              display: "grid",
              gridTemplateColumns: "repeat(4, 199px)",
              gap: "0px",
            }}>
              {CLIENTS.map((client, i) => (
                <div key={i} style={{
                  position: "relative",
                  width: "199px",
                  height: "215px",
                  borderBottom: i < 4 ? "0.8px dotted rgb(57, 54, 50)" : "none",
                }}>
                  <Image
                    src={client.svg}
                    alt={client.name}
                    width={199}
                    height={199}
                    unoptimized
                    style={{
                      display: "block",
                      width: "199px",
                      height: "199px",
                      objectFit: "contain",
                      objectPosition: "center",
                      opacity: 0.88,
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    bottom: "12px",
                    left: 0,
                    right: 0,
                    display: "block",
                    textAlign: "center",
                    fontSize: "10px",
                    lineHeight: 1.3,
                    color: "rgb(82, 77, 71)",
                    letterSpacing: "-0.18px",
                    textTransform: "uppercase",
                    fontFamily: '"Suisse Mono", "Courier New", monospace',
                    whiteSpace: "nowrap",
                  }}>
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile layout: label top + 2-col fluid grid ── */}
          <div className="flex md:hidden flex-col gap-8">
            <p style={{
              margin: 0,
              fontSize: "17.75px",
              lineHeight: 1.35,
              color: "rgb(232, 232, 227)",
              fontWeight: 500,
            }}>
              Clients whose realities we&apos;ve changed
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0px",
            }}>
              {CLIENTS.map((client, i) => (
                <div key={i} style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderBottom: i < 6 ? "0.8px dotted rgb(57, 54, 50)" : "none",
                  borderRight: i % 2 === 0 ? "0.8px dotted rgb(57, 54, 50)" : "none",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Image
                    src={client.svg}
                    alt={client.name}
                    width={199}
                    height={199}
                    unoptimized
                    style={{
                      display: "block",
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                      objectPosition: "center",
                      opacity: 0.88,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
