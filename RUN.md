# Ristan Marine - 실행 가이드

## 목차
1. [사전 준비](#1-사전-준비)
2. [환경변수 설정](#2-환경변수-설정)
3. [Supabase 설정](#3-supabase-설정)
4. [Cloudflare R2 설정](#4-cloudflare-r2-설정)
5. [이미지 업로드](#5-이미지-업로드)
6. [제품 데이터 임포트](#6-제품-데이터-임포트)
7. [관리자 계정 설정](#7-관리자-계정-설정)
8. [로컬 개발 서버 실행](#8-로컬-개발-서버-실행)
9. [Vercel 배포](#9-vercel-배포)
10. [기능 테스트 체크리스트](#10-기능-테스트-체크리스트)

---

## 1. 사전 준비

다음이 설치되어 있어야 합니다.

- **Node.js** 18 이상 → https://nodejs.org
- **npm** (Node.js에 포함)

의존성 설치 (이미 완료된 경우 스킵):

```bash
npm install
```

---

## 2. 환경변수 설정

`.env.local.example` 파일을 복사해서 `.env.local`을 만듭니다.

```bash
cp .env.local.example .env.local
```

`.env.local`을 텍스트 편집기로 열고 아래 값들을 채웁니다.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=ristan-marine-images
```

각 값을 가져오는 방법은 아래 섹션 3, 4에서 설명합니다.

---

## 3. Supabase 설정

### 3-1. 프로젝트 URL과 키 가져오기

1. https://supabase.com 로그인
2. 프로젝트 선택 → **Settings** → **API**
3. 다음 세 값을 `.env.local`에 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 3-2. 테이블 생성 (마이그레이션 실행)

Supabase 대시보드 → **SQL Editor** → **New query**

아래 파일을 순서대로 열어 내용을 복사 후 **Run** 클릭:

```
supabase/migrations/001_products.sql   ← 제품 테이블 + 인덱스 + RLS
supabase/migrations/002_users.sql      ← 사용자 프로필 테이블 + RLS
supabase/migrations/003_inquiries.sql  ← 문의 테이블 + RLS
```

> 실행 후 **Table Editor**에서 `products`, `user_profiles`, `inquiries` 테이블이 생성됐는지 확인합니다.

---

## 4. Cloudflare R2 설정

### 4-1. 버킷 생성

1. https://dash.cloudflare.com 로그인
2. 왼쪽 메뉴 **R2 Object Storage** → **Create bucket**
3. 버킷 이름: `ristan-marine-images` (또는 원하는 이름)
4. **Settings** → **Public access** → **Allow Access** 활성화
5. Public 도메인 확인 (예: `https://pub-abc123.r2.dev`) → `.env.local`의 `NEXT_PUBLIC_R2_PUBLIC_URL`에 입력

### 4-2. API 토큰 생성

1. Cloudflare 대시보드 → **R2** → **Manage R2 API Tokens** → **Create API Token**
2. 권한: **Object Read & Write**
3. 생성 후 표시되는 값을 `.env.local`에 복사:
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY`
4. **Account ID**는 대시보드 우측 사이드바에서 확인 → `R2_ACCOUNT_ID`

---

## 5. 이미지 업로드

`images/` 폴더의 사진들을 R2에 업로드합니다.
`.env.local`이 올바르게 채워진 후 실행하세요.

```bash
node scripts/upload-images.js --dir ./images
```

출력 예시:
```
📁 Found 3369 image files in ./images
📦 Target bucket: ristan-marine-images

⏭ Skipped: 0 | ✅ Uploaded: 3369 | ❌ Failed: 0

✨ Done!
   Uploaded: 3369
   Skipped:  0
   Failed:   0
```

이미 업로드된 파일은 자동으로 건너뜁니다. (재실행 안전)

---

## 6. 제품 데이터 임포트

`products.sql` (24MB, 약 55,000개 행)을 Supabase에 임포트합니다.

### 방법 A: psql CLI (권장)

Supabase 대시보드 → **Settings** → **Database** → **Connection string** → `URI` 탭에서 주소 복사

```bash
psql "postgresql://postgres.xxxx:password@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres" -f products.sql
```

### 방법 B: SQL Editor (파일이 크면 분할 필요)

파일이 너무 크면 아래 스크립트로 분할 후 각각 실행:

```bash
# 10,000행씩 분할 (Node.js)
node -e "
const fs = require('fs');
const lines = fs.readFileSync('products.sql', 'utf8').split('\n');
let chunk = 0, out = [];
lines.forEach((line, i) => {
  out.push(line);
  if (out.length >= 500 && line.startsWith('INSERT')) {
    fs.writeFileSync('products_part' + (++chunk) + '.sql', out.join('\n'));
    out = [];
  }
});
if (out.length) fs.writeFileSync('products_part' + (++chunk) + '.sql', out.join('\n'));
console.log('Split into', chunk, 'files');
"
```

---

## 7. 관리자 계정 설정

### 7-1. Supabase Auth에서 관리자 계정 생성

1. Supabase 대시보드 → **Authentication** → **Users** → **Add user**
2. 이메일과 비밀번호 입력 후 생성
3. 생성된 유저의 **User UID** 복사

### 7-2. 관리자 역할(role) 부여

Supabase 대시보드 → **SQL Editor**에서 실행:

```sql
-- 아래 'your-admin-user-uuid'를 실제 UID로 교체
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'your-admin-user-uuid';
```

> 관리자는 `/admin` 페이지에 접근할 수 있으며, 제품 수정 및 계정 관리 권한이 생깁니다.

### 7-3. 일반 도감 계정 생성

관리자로 `/admin/users` 페이지 접속 후 **계정 생성** 버튼 사용 (이용기간 30/60/90/180/365일 선택).

---

## 8. 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

| 페이지 | URL |
|--------|-----|
| 홈 | http://localhost:3000 |
| 회사소개 | http://localhost:3000/company |
| 사업분야 | http://localhost:3000/business |
| 문의하기 | http://localhost:3000/inquiry |
| 도감 로그인 | http://localhost:3000/catalog/login |
| 도감 | http://localhost:3000/catalog |
| 관리자 | http://localhost:3000/admin |

---

## 9. Vercel 배포

### 9-1. Vercel CLI 설치 (최초 1회)

```bash
npm install -g vercel
vercel login
```

### 9-2. 환경변수 등록

Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**에서
`.env.local`의 모든 키-값을 동일하게 입력합니다.

또는 CLI로 일괄 등록:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_R2_PUBLIC_URL
vercel env add R2_ACCOUNT_ID
vercel env add R2_ACCESS_KEY_ID
vercel env add R2_SECRET_ACCESS_KEY
vercel env add R2_BUCKET_NAME
```

### 9-3. 배포

```bash
vercel --prod
```

---

## 10. 기능 테스트 체크리스트

### 공개 페이지
- [ ] 홈 (`/`) 로드 정상 확인
- [ ] 기업정보 서브 메뉴 4개 모두 확인
- [ ] 문의하기 폼 제출 → Supabase `inquiries` 테이블에 행 추가됐는지 확인

### 도감
- [ ] `/catalog/login` 에서 생성한 계정으로 로그인
- [ ] `/catalog` 에서 AG Grid에 제품 데이터 표시 확인
- [ ] 검색창에 제품명 입력 후 필터링 확인
- [ ] 카테고리 사이드바 클릭 시 필터링 확인
- [ ] 만료 계정으로 로그인 시 `/catalog/expired` 리다이렉트 확인

### 관리자
- [ ] 관리자 계정으로 `/admin` 접속 확인
- [ ] `/admin/products` - 셀 더블클릭 편집 후 새로고침해도 저장 유지 확인
- [ ] `/admin/users` - 새 계정 생성 후 목록에 표시 확인
- [ ] 일반 계정으로 `/admin` 접속 시 403 확인

---

## 트러블슈팅

**`SUPABASE_SERVICE_ROLE_KEY` 관련 오류**
- Supabase Settings → API → `service_role` 키가 맞는지 확인 (anon 키와 혼동 주의)

**AG Grid 데이터가 안 보임**
- 브라우저 개발자 도구 → Network 탭에서 `/api/products` 응답 확인
- Supabase RLS 정책이 올바르게 적용됐는지 확인

**이미지가 안 보임**
- R2 버킷의 **Public access**가 활성화됐는지 확인
- `NEXT_PUBLIC_R2_PUBLIC_URL`이 `/`로 끝나지 않는지 확인

**관리자 페이지 403**
- `raw_app_meta_data`에 `role: admin`이 설정됐는지 SQL로 확인:
  ```sql
  SELECT id, raw_app_meta_data FROM auth.users WHERE email = 'your-admin@email.com';
  ```
