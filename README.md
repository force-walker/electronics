# Electronics Learning Game (MVP)

中高生向けの「電気工学を学ぶオンラインゲーム/シミュレーション」MVPです。

## Scope (MVP)
- Stage 1: 電圧・電流・抵抗
- Stage 2: オームの法則
- Stage 3: 直列・並列
- JP/EN 切り替え
- 低負荷UI（SVG/DOM）

## Tech
- React + TypeScript + Vite
- Zustand

## Quick Start
```bash
npm install
npm run dev
```

## Project Structure
- `docs/MVP_SPEC.md` 仕様書
- `src/` 実装

## Notes
- 計算エンジンはMVPのため簡易版（series / parallel中心）
- 将来、節点法ソルバに差し替え可能な構成
