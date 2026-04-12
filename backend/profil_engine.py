"""
profil_engine.py
================
Genererer en menneskelig lesbar, norsk profilbeskrivelse basert på dimensjonscorer.

Brukes av recommendation_engine for å produsere ProfilBeskrivelse-objektet
som frontend viser på resultatssiden.

Logikk:
  1. Kategoriser dimensjoner i grupper (fagfelt, ferdigheter, arbeidsstil, verdier, karriere)
  2. Plukk ut topprepresentanter per gruppe
  3. Bygg naturlig norsk tekst fra maler
  4. Returner ProfilBeskrivelse med alle felt fylt ut
"""

from __future__ import annotations

import unicodedata
from typing import Any

from schemas import ProfilBeskrivelse


# ---------------------------------------------------------------------------
# Dimensjonsgrupper — hvilke dimensjoner tilhører hvilken gruppe
# ---------------------------------------------------------------------------

_FAGFELT_DIMS: set[str] = {
    "Teknologi", "Økonomi", "Kunst og design", "Samfunnsfag",
    "Språk og kultur", "Språk", "Humaniora", "Miljø", "Bærekraft",
    "Praktiske fag", "Yrkesnærhet", "Helse", "Helseinteresse",
    "Tverrfaglig", "Faglig relevans",
}

_FERDIGHET_DIMS: set[str] = {
    "Kritisk tenkning", "Analytisk", "Problemløsning",
    "Teknologisk forståelse", "Empati", "Kommunikasjon",
    "Kreativitet", "Samarbeid", "Struktur", "Ledelse", "Planlegging",
    "Sosialitet", "Selvstendighet", "Ambisjon",
}

_ARBEIDSSTIL_DIMS: set[str] = {
    "Teoretisk", "Praktisk", "Sosial", "Visuell", "Selvstendig",
    "Strukturert", "Variert", "Raskt tempo", "Fleksibel",
    "Tilpasningsdyktig", "Samarbeidsorientert", "Kreativ",
    "Reisevillighet", "Fysisk oppmøte", "Stasjonær",
    "Moderat mobilitet", "Moderat samarbeid",
}

_VERDI_DIMS: set[str] = {
    "Prestasjon", "Lønn", "Mening", "Trygghet", "Fleksibilitet",
    "Arbeidsmiljø", "Stabilitet", "Frihet", "Kreativ frihet",
    "Karriereutvikling", "Innovasjon", "Anerkjennelse", "Nøytral",
}

_KARRIERE_DIMS: set[str] = {
    "Leder", "Spesialist", "Gründer", "Tydelig retning",
    "Stabilt ansettelsesforhold", "Studere videre",
    "Jobb direkte etter studier",
}

_LAERING_DIMS: set[str] = {
    "Teoretisk", "Praktisk", "Visuell", "Sosial",
    "AI-verktøy", "Samarbeidsorientert",
}


# ---------------------------------------------------------------------------
# Korte beskrivelser per dimensjon (brukes til å bygge tekst)
# ---------------------------------------------------------------------------

_DIM_BESKRIVELSE: dict[str, str] = {
    # Fagfelt
    "Teknologi":               "teknologi og digitale løsninger",
    "Økonomi":                 "økonomi, forretning og tallarbeid",
    "Kunst og design":         "kunst, design og kreative uttrykk",
    "Samfunnsfag":             "samfunn, politikk og menneskelige relasjoner",
    "Språk og kultur":         "språk, kultur og humanistiske fag",
    "Språk":                   "språk og kommunikasjon på tvers av kulturer",
    "Humaniora":               "humaniora, historie og filosofi",
    "Miljø":                   "miljø, klima og bærekraft",
    "Bærekraft":               "bærekraft og miljøbevissthet",
    "Praktiske fag":           "praktiske og tekniske fag",
    "Yrkesnærhet":             "yrkesnære og praksisorienterte fag",
    "Helse":                   "helse, medisin og omsorg",
    "Helseinteresse":          "helse og livsvitenskap",
    "Tverrfaglig":             "tverrfaglige og sammensatte problemstillinger",
    # Ferdigheter
    "Kritisk tenkning":        "kritisk og analytisk tenkning",
    "Analytisk":               "analytisk tilnærming til problemer",
    "Problemløsning":          "evne til å finne gode løsninger",
    "Teknologisk forståelse":  "teknologisk forståelse og digital kompetanse",
    "Empati":                  "empati og mellommenneskelig forståelse",
    "Kommunikasjon":           "sterk muntlig og skriftlig kommunikasjon",
    "Kreativitet":             "kreativitet og evne til nytenkning",
    "Samarbeid":               "samarbeid og teamorientering",
    "Struktur":                "struktur, planlegging og systematikk",
    "Ledelse":                 "lederskap og evne til å motivere andre",
    "Planlegging":             "planlegging og organisering",
    "Sosialitet":              "sosiale ferdigheter og relasjonsbygging",
    "Selvstendighet":          "selvstendighet og evne til å ta egne beslutninger",
    "Ambisjon":                "ambisjoner og driv mot mål",
    # Arbeidsstil
    "Teoretisk":               "teoretisk og analytisk tilnærming",
    "Praktisk":                "praktisk og hands-on tilnærming",
    "Sosial":                  "sosial og samarbeidsorientert arbeidsform",
    "Visuell":                 "visuell og estetisk tilnærming",
    "Selvstendig":             "selvstendig arbeidsform med stor autonomi",
    "Strukturert":             "strukturert og systematisk arbeidsform",
    "Variert":                 "variert arbeidsdag med skiftende oppgaver",
    "Raskt tempo":             "høyt tempo og dynamiske miljøer",
    "Fleksibel":               "fleksibel og tilpasningsdyktig",
    "Tilpasningsdyktig":       "tilpasningsdyktig og komfortabel med endring",
    "Samarbeidsorientert":     "samarbeid og tverrfaglig jobbing",
    "Kreativ":                 "kreativ og utforskende arbeidsform",
    "Reisevillighet":          "villighet til å reise og jobbe på ulike steder",
    # Verdier
    "Prestasjon":              "ambisjoner og ønske om å prestere",
    "Lønn":                    "god lønn og materielle belønninger",
    "Mening":                  "meningsfullt arbeid og samfunnsbidrag",
    "Trygghet":                "trygghet og forutsigbarhet i hverdagen",
    "Fleksibilitet":           "frihet og fleksibilitet i hverdagen",
    "Arbeidsmiljø":            "godt arbeidsmiljø og sterkt fellesskap",
    "Stabilitet":              "stabilitet og langsiktig trygghet",
    "Frihet":                  "autonomi og frihet til å forme egen arbeidshverdag",
    "Kreativ frihet":          "kreativ frihet og rom for egne ideer",
    "Karriereutvikling":       "kontinuerlig vekst og karriereutvikling",
    "Innovasjon":              "innovasjon og arbeid i forkant av utviklingen",
    "Anerkjennelse":           "anerkjennelse og synlighet i jobben",
    # Karriere
    "Leder":                   "lederrollen med personalansvar og strategisk ansvar",
    "Spesialist":              "faglig dybde og ekspertise innen ett felt",
    "Gründer":                 "entrepenørskap og å bygge noe eget",
    "Tydelig retning":         "en tydelig og planlagt karrierevei",
    "Stabilt ansettelsesforhold": "fast og stabilt ansettelsesforhold",
    "Studere videre":          "videreutdanning og akademisk fordypning",
}


# ---------------------------------------------------------------------------
# Hjelpefunksjoner
# ---------------------------------------------------------------------------

def _normaliser(tekst: str) -> str:
    nfkd = unicodedata.normalize("NFKD", tekst)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower().strip()


def _topp_fra_gruppe(
    dimensjon_scores: dict[str, float],
    gruppe: set[str],
    n: int = 3,
) -> list[tuple[str, float]]:
    """Returnerer de n høyest scorende dimensjonene fra en gitt gruppe."""
    kandidater = [
        (dim, score)
        for dim, score in dimensjon_scores.items()
        if dim in gruppe and score > 0
    ]
    return sorted(kandidater, key=lambda x: x[1], reverse=True)[:n]


def _beskriv_list(dims: list[tuple[str, float]], standard: str = "") -> str:
    """Gjør liste med (dim, score) til en naturlig norsk oppramsing."""
    tekster = [_DIM_BESKRIVELSE.get(d, d.lower()) for d, _ in dims]
    if not tekster:
        return standard
    if len(tekster) == 1:
        return tekster[0]
    return ", ".join(tekster[:-1]) + " og " + tekster[-1]


# ---------------------------------------------------------------------------
# Tekstmaler per situasjon
# ---------------------------------------------------------------------------

_FAGFELT_INNLEDNING = [
    "Du har en tydelig interesse for {fag}.",
    "Faglig sett trekkes du mot {fag}.",
    "Din profil viser sterk interesse for {fag}.",
    "Du er engasjert innen {fag}.",
]

_ARBEIDSSTIL_TEKST: dict[str, str] = {
    "Teoretisk":           "analytisk",
    "Praktisk":            "praktisk",
    "Sosial":              "sosial",
    "Strukturert":         "strukturert",
    "Selvstendig":         "selvstendig",
    "Variert":             "variert",
    "Raskt tempo":         "fartsfylt",
    "Kreativ":             "kreativ",
    "Tilpasningsdyktig":   "tilpasningsdyktig",
    "Samarbeidsorientert": "samarbeidsorientert",
    "Visuell":             "visuell",
    "Fleksibel":           "fleksibel",
    "Moderat samarbeid":   "selvstendig",
    "Stasjonær":           "stabil",
    "Reisevillighet":      "mobil",
}

_LAERING_TEKST: dict[str, str] = {
    "Teoretisk":           "du lærer best gjennom teori, lesing og systematisk analyse",
    "Praktisk":            "du lærer best ved å gjøre ting selv og jobbe med virkelige oppgaver",
    "Sosial":              "du trives med å lære gjennom dialog, diskusjon og samarbeid",
    "Visuell":             "du lærer best visuelt — gjennom bilder, modeller og presentasjoner",
    "AI-verktøy":          "du er komfortabel med å bruke digitale verktøy og AI i læringen",
    "Samarbeidsorientert": "du lærer godt i team og tverrfaglige settinger",
    "Variert":             "du trives med variasjon i læringsformer",
}

_MOTIVASJON_TEKST: dict[str, str] = {
    "Mening":           "du motiveres av å gjøre en forskjell og bidra til noe større enn deg selv",
    "Prestasjon":       "du drives av ambisjoner og ønsket om å prestere og nå mål",
    "Lønn":             "god lønn og materielle goder er viktige motivasjonsfaktorer for deg",
    "Trygghet":         "trygghet, stabilitet og forutsigbarhet er det du setter høyest",
    "Frihet":           "du motiveres av autonomi og friheten til å forme din egen hverdag",
    "Arbeidsmiljø":     "et godt arbeidsmiljø og sterkt fellesskap er avgjørende for deg",
    "Kreativ frihet":   "du trives best når du har rom til kreativitet og egne ideer",
    "Karriereutvikling": "kontinuerlig vekst og muligheten til å utvikle deg er det viktigste",
    "Innovasjon":       "du trives i miljøer som er i front av utviklingen og tør å tenke nytt",
    "Stabilitet":       "langsiktig stabilitet og trygghet i ansettelsesforhold er viktig for deg",
    "Anerkjennelse":    "anerkjennelse for innsatsen din og det å bli sett motiverer deg sterkt",
}

_KARRIERE_TEKST: dict[str, str] = {
    "Leder":            "du ser for deg en karriere der du leder andre og har strategisk ansvar",
    "Spesialist":       "du ønsker å bli en anerkjent ekspert innen et spesifikt fagfelt",
    "Gründer":          "du har entrepenørielle ambisjoner og drømmer om å bygge noe eget",
    "Tydelig retning":  "du er tydelig på retningen og vet hva du vil med karrieren",
    "Stabilt ansettelsesforhold": "du setter pris på fast og stabilt arbeid over tid",
    "Studere videre":   "du ser for deg videre studier og akademisk fordypning",
}


# ---------------------------------------------------------------------------
# Hoved-funksjon
# ---------------------------------------------------------------------------

def lag_profil_beskrivelse(
    dimensjon_scores: dict[str, float],
    brukertype: str = "elev",
) -> ProfilBeskrivelse:
    """
    Genererer en norsk ProfilBeskrivelse fra dimensjonscorer.

    Args:
        dimensjon_scores: Dict med dimensjonslabels → akkumulert score
        brukertype: "elev", "student" eller "arbeidstaker"

    Returns:
        ProfilBeskrivelse med alle felt fylt ut på norsk
    """
    # Plukk topp per gruppe
    topp_fag = _topp_fra_gruppe(dimensjon_scores, _FAGFELT_DIMS, n=3)
    topp_ferd = _topp_fra_gruppe(dimensjon_scores, _FERDIGHET_DIMS, n=3)
    topp_arbeid = _topp_fra_gruppe(dimensjon_scores, _ARBEIDSSTIL_DIMS, n=2)
    topp_verdi = _topp_fra_gruppe(dimensjon_scores, _VERDI_DIMS, n=2)
    topp_karriere = _topp_fra_gruppe(dimensjon_scores, _KARRIERE_DIMS, n=1)
    topp_laering = _topp_fra_gruppe(dimensjon_scores, _LAERING_DIMS, n=2)

    # -----------------------------------------------------------------------
    # Profil-sammendrag
    # -----------------------------------------------------------------------
    fag_tekst = _beskriv_list(topp_fag, "et bredt faglig spekter")
    arbeid_tekst = (
        _ARBEIDSSTIL_TEKST.get(topp_arbeid[0][0], "allsidig") if topp_arbeid else "allsidig"
    )
    verdi_dim = topp_verdi[0][0] if topp_verdi else None
    verdi_tekst = _MOTIVASJON_TEKST.get(verdi_dim, "") if verdi_dim else ""

    karriere_dim = topp_karriere[0][0] if topp_karriere else None
    karriere_tekst = _KARRIERE_TEKST.get(karriere_dim, "") if karriere_dim else ""

    # Bygg sammendrag basert på brukertype
    # Kombiner fagfelt og topp-ferdighet for mer nyansert setning
    topp_ferd_tekst = _DIM_BESKRIVELSE.get(topp_ferd[0][0], "") if topp_ferd else ""

    if brukertype == "elev":
        sammendrag = (
            f"Du er en {arbeid_tekst} elev med sterk interesse for {fag_tekst}. "
        )
        if topp_ferd_tekst:
            sammendrag += f"En av de fremste styrkene dine er {topp_ferd_tekst}. "
    elif brukertype == "student":
        sammendrag = (
            f"Du er en {arbeid_tekst} student med faglig tyngde innen {fag_tekst}. "
        )
        if topp_ferd_tekst:
            sammendrag += f"Du skiller deg ut med {topp_ferd_tekst}. "
    else:  # arbeidstaker
        sammendrag = (
            f"Du er en erfaren og {arbeid_tekst} fagperson med bakgrunn innen {fag_tekst}. "
        )
        if topp_ferd_tekst:
            sammendrag += f"Du bringer særlig styrke innen {topp_ferd_tekst}. "

    if verdi_tekst:
        sammendrag += verdi_tekst.capitalize() + ". "
    if karriere_tekst:
        sammendrag += karriere_tekst.capitalize() + "."

    sammendrag = sammendrag.strip()

    # -----------------------------------------------------------------------
    # Styrker — topp ferdigheter
    # -----------------------------------------------------------------------
    styrker: list[str] = [dim for dim, _ in topp_ferd]
    if not styrker:
        # Fallback: bruk topp fagfelt-dimensjoner
        styrker = [dim for dim, _ in topp_fag[:2]]
    if not styrker:
        styrker = ["Allsidighet", "Nysgjerrighet"]

    # -----------------------------------------------------------------------
    # Læringsstil
    # -----------------------------------------------------------------------
    laering_dim = topp_laering[0][0] if topp_laering else None
    laringsstil = _LAERING_TEKST.get(laering_dim, "du er tilpasningsdyktig i læringsmetoder og trives med variasjon")

    # -----------------------------------------------------------------------
    # Arbeidsstil (utfyllende)
    # -----------------------------------------------------------------------
    if topp_arbeid:
        arbeid_adj_liste = [
            _ARBEIDSSTIL_TEKST.get(d, d.lower()) for d, _ in topp_arbeid[:2]
        ]
        if len(arbeid_adj_liste) == 1:
            arbeidsstil_str = f"Du trives best med en {arbeid_adj_liste[0]} arbeidsform."
        else:
            arbeidsstil_str = (
                f"Du trives best med en {arbeid_adj_liste[0]} og "
                f"{arbeid_adj_liste[1]} arbeidsform."
            )
    else:
        arbeidsstil_str = "Du er fleksibel i arbeidsstil og tilpasser deg godt ulike settinger."

    # -----------------------------------------------------------------------
    # Motivasjonsstil — bruk #1 motivasjon som primær setning
    # -----------------------------------------------------------------------
    if topp_verdi:
        prim_verdi = topp_verdi[0][0]
        sek_verdi = topp_verdi[1][0] if len(topp_verdi) > 1 else None
        prim_tekst = _MOTIVASJON_TEKST.get(prim_verdi, f"å oppnå {prim_verdi.lower()}")
        if sek_verdi and sek_verdi != prim_verdi:
            sek_kort = _DIM_BESKRIVELSE.get(sek_verdi, sek_verdi.lower())
            motivasjonsstil = f"{prim_tekst.capitalize()}, og setter også {sek_kort} høyt."
        else:
            motivasjonsstil = f"{prim_tekst.capitalize()}."
    else:
        motivasjonsstil = "Du drives av nysgjerrighet og ønsket om å skape noe meningsfullt."

    # -----------------------------------------------------------------------
    # Karriere-orientering
    # -----------------------------------------------------------------------
    if karriere_tekst:
        karriere_orientering = karriere_tekst.capitalize() + "."
    elif topp_karriere:
        karriere_orientering = f"Du er orientert mot {_DIM_BESKRIVELSE.get(topp_karriere[0][0], 'en klar karrierevei')}."
    else:
        karriere_orientering = "Du er åpen for ulike karriereveier og utforsker mulighetene."

    return ProfilBeskrivelse(
        profil_sammendrag=sammendrag,
        styrker=styrker[:4],  # maks 4 styrker for ryddig visning
        laringsstil=laringsstil,
        arbeidsstil=arbeidsstil_str,
        motivasjonsstil=motivasjonsstil,
        karriere_orientering=karriere_orientering,
    )
