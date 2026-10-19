# kirins-playground

小さなブラウザ上の音楽ユーティリティ群を集めたプレイグラウンドです。

目的
- 各 HTML ファイルの見た目と操作性を段階的に統一するための第一歩として、共通の CSS（normalize + site.css）を導入しました。

変更点（unify-ui ブランチ）
- css/normalize.css を追加（簡易リセット）
- css/site.css を追加（カラーパレット、基本ユーティリティ、レスポンシブ土台）
- index.html と各 HTML ファイルの head に style シートの link を追加
- U-FRET 管理ファイルに meta viewport を追加（モバイル表示改善）

進め方
1. このブランチで動作を確認してください（example: python -m http.server）。
2. 望ましい見た目に合わせて site.css のカラーパレットやユーティリティを調整します。
3. 個別ページの詳細スタイルは段階的に site.css に移行していきます（PR を小さく分けて進めます）。

運用メモ
- 現時点では既存インライン CSS を無効化せずに共通 CSS を追加しています。既存スタイルを完全に置き換える場合は、それぞれの HTML を個別に編集する PR を作成します。

maintainer: tokyo-programmer
