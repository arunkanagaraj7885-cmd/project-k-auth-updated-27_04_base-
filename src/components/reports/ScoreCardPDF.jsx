'use client';
import { Document, Page, View, Text, StyleSheet, Svg, Circle, Path } from '@react-pdf/renderer';

const DARK_TEAL  = '#0d3d35';
const TEAL_600   = '#0f766e';
const TEAL_400   = '#2dd4bf';
const AMBER      = '#f59e0b';
const GREEN_500  = '#22c55e';
const BLUE_500   = '#3b82f6';
const SLATE_800  = '#1e293b';
const SLATE_600  = '#475569';
const SLATE_500  = '#64748b';
const SLATE_400  = '#94a3b8';
const SLATE_200  = '#e2e8f0';
const SLATE_100  = '#f1f5f9';

const S = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff' },

  /* ── Header (compact) ── */
  header: {
    backgroundColor: DARK_TEAL,
    paddingHorizontal: 40,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logoBox: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: TEAL_600,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  logoText:    { color: '#ffffff', fontSize: 17, fontFamily: 'Helvetica-Bold' },
  headerTitle: { color: '#ffffff', fontSize: 17, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 2 },
  headerSub:   { color: TEAL_400, fontSize: 8, textAlign: 'center', marginBottom: 10 },
  scoreWrap:   { alignItems: 'center', marginBottom: 8 },
  scoreNum:    { color: '#ffffff', fontSize: 32, fontFamily: 'Helvetica-Bold', lineHeight: 1 },
  scoreLbl:    { color: 'rgba(255,255,255,0.5)', fontSize: 7, letterSpacing: 1.5, marginTop: 2, textAlign: 'center' },
  readyTitle:  { color: '#ffffff', fontSize: 13, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 3 },
  readyDesc:   { color: '#cbd5e1', fontSize: 7.5, textAlign: 'center', lineHeight: 1.4, maxWidth: 360 },

  /* ── Body ── */
  body: { paddingHorizontal: 28, paddingTop: 14, paddingBottom: 10, gap: 10 },

  /* Candidate chip */
  chip: {
    backgroundColor: DARK_TEAL,
    borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  avatarCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: TEAL_600,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:  { color: '#ffffff', fontSize: 15, fontFamily: 'Helvetica-Bold' },
  chipName:    { color: '#ffffff', fontSize: 12, fontFamily: 'Helvetica-Bold' },
  chipDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'stretch', marginHorizontal: 4 },
  chipInfo:    { gap: 5 },
  chipRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chipDot:     { width: 4, height: 4, borderRadius: 2, backgroundColor: TEAL_400 },
  chipKey:     { color: TEAL_400, fontSize: 7.5, fontFamily: 'Helvetica-Bold' },
  chipVal:     { color: '#a7f3d0', fontSize: 7.5 },

  /* Section header row */
  secRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  secTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: SLATE_800 },
  secSub:   { fontSize: 7, color: SLATE_400 },

  /* Snapshot */
  snapBorder: { borderWidth: 1, borderColor: SLATE_200, borderRadius: 12, padding: 10 },
  snapRow:    { flexDirection: 'row', gap: 8 },
  snapCard:   { flex: 1, borderWidth: 1, borderColor: SLATE_100, borderRadius: 8, padding: 9, alignItems: 'center' },
  snapIcon:   { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  snapCat:    { fontSize: 6, fontFamily: 'Helvetica-Bold', color: TEAL_600, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3, textAlign: 'center' },
  snapVal:    { fontSize: 17, fontFamily: 'Helvetica-Bold', color: SLATE_800, lineHeight: 1 },
  snapValGrn: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: TEAL_600, lineHeight: 1 },
  snapUnit:   { fontSize: 8, color: SLATE_400 },
  snapDesc:   { fontSize: 7, color: SLATE_500, marginTop: 3, textAlign: 'center', lineHeight: 1.3 },

  /* Core Scores */
  barRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  barLbl:   { fontSize: 8, color: '#334155', width: 110 },
  barTrack: { flex: 1, height: 7, backgroundColor: SLATE_100, borderRadius: 3 },
  barFill:  { height: 7, backgroundColor: DARK_TEAL, borderRadius: 3 },
  barNum:   { fontSize: 8, fontFamily: 'Helvetica-Bold', color: SLATE_800, width: 22, textAlign: 'right' },

  /* Key Summary */
  sumItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 7 },
  sumDot:  { width: 7, height: 7, borderRadius: 4, marginTop: 1.5 },
  sumText: { flex: 1, fontSize: 8, color: SLATE_600, lineHeight: 1.4 },

  /* Verified badge */
  verified: {
    borderWidth: 1, borderColor: SLATE_200, borderRadius: 12,
    padding: 10, flexDirection: 'row', alignItems: 'center',
    gap: 10, backgroundColor: '#f8fafc',
  },
  verifiedIcon:  { width: 30, height: 30, borderRadius: 7, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  verifiedTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: SLATE_800 },
  verifiedSub:   { fontSize: 7, color: SLATE_500, marginTop: 2 },

  /* Footer */
  footer: {
    paddingHorizontal: 28, paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: SLATE_200,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  footerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerBrand: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: SLATE_800 },
  footerPipe:  { fontSize: 8, color: SLATE_400, marginHorizontal: 2 },
  footerSub:   { fontSize: 8, color: SLATE_500 },
  footerDate:  { fontSize: 7.5, color: SLATE_400 },
});

/* ── Amber score arc (compact 96×96) ── */
function ScoreArc({ score }) {
  const r         = 38;
  const cx        = 48, cy = 48;
  const circ      = 2 * Math.PI * r;
  const safeScore = Math.max(0, Math.min(Number(score) || 0, 100));
  const fill      = (safeScore / 100) * circ;
  const gap       = circ - fill;
  return (
    <Svg width="96" height="96" viewBox="0 0 96 96">
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
      <Circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={AMBER} strokeWidth="9"
        strokeDasharray={`${fill},${gap}`}
        strokeLinecap="round"
        transform={`rotate(-90, ${cx}, ${cy})`}
      />
    </Svg>
  );
}

export default function ScoreCardPDF({ card }) {
  if (!card) return null;
  const date    = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const initial = card.candidate_name?.[0]?.toUpperCase() ?? '?';

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={S.page}>

        {/* ══ HEADER ══ */}
        <View style={S.header}>
          <View style={S.logoBox}>
            <Text style={S.logoText}>K</Text>
          </View>
          <Text style={S.headerTitle}>Project K Interview Score Card</Text>
          <Text style={S.headerSub}>Quick recruiter-friendly summary</Text>

          <View style={S.scoreWrap}>
            <View style={{ width: 96, height: 96, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              <ScoreArc score={card.score} />
              <View style={{ position: 'absolute', alignItems: 'center' }}>
                <Text style={S.scoreNum}>{card.score}</Text>
                <Text style={S.scoreLbl}>SCORE</Text>
              </View>
            </View>
          </View>

          <Text style={S.readyTitle}>{card.readiness_label}</Text>
          <Text style={S.readyDesc}>{card.readiness_desc}</Text>
        </View>

        {/* ══ BODY ══ */}
        <View style={S.body}>

          {/* Candidate chip */}
          <View style={S.chip}>
            <View style={S.avatarCircle}>
              <Text style={S.avatarText}>{initial}</Text>
            </View>
            <Text style={S.chipName}>{card.candidate_name}</Text>
            <View style={S.chipDivider} />
            <View style={S.chipInfo}>
              <View style={S.chipRow}>
                <View style={S.chipDot} />
                <Text style={S.chipKey}>Role: </Text>
                <Text style={S.chipVal}>{card.role}</Text>
              </View>
              <View style={S.chipRow}>
                <View style={S.chipDot} />
                <Text style={S.chipKey}>Mode: </Text>
                <Text style={S.chipVal}>{card.mode === 'full' ? 'Full Interview' : 'Mock Interview'}</Text>
              </View>
            </View>
          </View>

          {/* Snapshot */}
          <View style={S.snapBorder}>
            <View style={S.secRow}>
              <Text style={S.secTitle}>Snapshot</Text>
              <Text style={S.secSub}>What matters most</Text>
            </View>
            <View style={S.snapRow}>
              {/* Communication */}
              <View style={S.snapCard}>
                <View style={[S.snapIcon, { backgroundColor: '#f0fdf4' }]}>
                  <Svg width="14" height="14" viewBox="0 0 24 24">
                    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke={TEAL_600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <Text style={S.snapCat}>Communication</Text>
                <Text style={S.snapVal}>{card.snapshot.communication}<Text style={S.snapUnit}>/10</Text></Text>
                <Text style={S.snapDesc}>{card.snapshot.communication_label}</Text>
              </View>
              {/* Confidence */}
              <View style={S.snapCard}>
                <View style={[S.snapIcon, { backgroundColor: '#eff6ff' }]}>
                  <Svg width="14" height="14" viewBox="0 0 24 24">
                    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={BLUE_500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="none" stroke={BLUE_500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <Text style={S.snapCat}>Confidence</Text>
                <Text style={S.snapVal}>{card.snapshot.confidence}<Text style={S.snapUnit}>/10</Text></Text>
                <Text style={S.snapDesc}>{card.snapshot.confidence_label}</Text>
              </View>
              {/* Recommendation */}
              <View style={S.snapCard}>
                <View style={[S.snapIcon, { backgroundColor: '#f0fdf4' }]}>
                  <Svg width="14" height="14" viewBox="0 0 24 24">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={GREEN_500} stroke={GREEN_500} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <Text style={S.snapCat}>Recommendation</Text>
                <Text style={S.snapValGrn}>{card.snapshot.recommendation}</Text>
                <Text style={S.snapDesc}>{card.snapshot.recommendation_label}</Text>
              </View>
            </View>
          </View>

          {/* Core Scores */}
          <View>
            <View style={S.secRow}>
              <Text style={S.secTitle}>Core Scores</Text>
              <Text style={S.secSub}>Simple score view</Text>
            </View>
            {card.core_scores.map((s) => (
              <View key={s.label} style={S.barRow}>
                <Text style={S.barLbl}>{s.label}</Text>
                <View style={S.barTrack}>
                  <View style={[S.barFill, { width: `${Math.min((s.value / 10) * 100, 100)}%` }]} />
                </View>
                <Text style={S.barNum}>{s.value}</Text>
              </View>
            ))}
          </View>

          {/* Key Summary */}
          <View>
            <View style={S.secRow}>
              <Text style={S.secTitle}>Key Summary</Text>
              <Text style={S.secSub}>Easy to scan</Text>
            </View>
            {card.key_summary.map((item, i) => (
              <View key={i} style={S.sumItem}>
                <View style={[S.sumDot, { backgroundColor: item.type === 'positive' ? GREEN_500 : AMBER }]} />
                <Text style={S.sumText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Verified badge */}
          <View style={S.verified}>
            <View style={S.verifiedIcon}>
              <Svg width="16" height="16" viewBox="0 0 24 24">
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke={TEAL_600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M9 12l2 2 4-4" fill="none" stroke={TEAL_600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View>
              <Text style={S.verifiedTitle}>Verified by Project K AI Interview Assessment</Text>
              <Text style={S.verifiedSub}>Recruiter view generated for quick screening</Text>
            </View>
          </View>

        </View>

        {/* ══ FOOTER ══ */}
        <View style={S.footer}>
          <View style={S.footerLeft}>
            <Text style={S.footerBrand}>projectk.io</Text>
            <Text style={S.footerPipe}> | </Text>
            <Text style={S.footerSub}>AI Interview Coaching</Text>
          </View>
          <Text style={S.footerDate}>Generated on {date}</Text>
        </View>

      </Page>
    </Document>
  );
}
