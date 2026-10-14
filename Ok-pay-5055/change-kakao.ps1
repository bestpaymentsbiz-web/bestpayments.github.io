# 상담 링크(카카오 오픈채팅/채널, 인스타그램, 텔레그램 등) 일괄 변경 스크립트
# 사용법: .\change-kakao.ps1 -NewLink "https://pf.kakao.com/_xxxxx"
#
# 폴더 안 html 파일들을 스캔해서 "현재 쓰이고 있는 상담 링크"를 자동으로 찾아
# 새 링크로 전부 바꿔줍니다. (매번 다시 실행해도 항상 현재 링크 기준으로 동작)
# - 감지 대상 1: data-consult-link 표시가 붙은 상담 버튼 (어떤 주소든 감지됨)
# - 감지 대상 2: open.kakao.com / pf.kakao.com / qr.kakao.com / han.gl 주소
# - 감지 대상 3: 카톡 아이콘(fa-comment)이 붙은 버튼의 링크
# - 여러 종류의 링크가 섞여 있으면 모두 새 링크 하나로 통일됨
# - https:// 를 빼고 입력하면 자동으로 붙여줌 (예: pf.kakao.com/_xxxxx)
# - 특정 옛 링크만 지정해서 바꾸고 싶으면 -OldLink 옵션으로 직접 지정 가능

param(
    [Parameter(Mandatory = $true)]
    [string]$NewLink,
    [string]$OldLink,
    [switch]$DryRun
)

$NewLink = $NewLink.Trim()
$dir = $PSScriptRoot
$files = Get-ChildItem -Path $dir -Filter *.html
$encoding = New-Object System.Text.UTF8Encoding($false)

if ($NewLink -notmatch '^[a-zA-Z][a-zA-Z0-9+.-]*://') {
    $NewLink = "https://" + $NewLink
}
if ($NewLink -notmatch '^https?://[^\s/]+\.[^\s]+$') {
    Write-Host "링크 형식이 올바르지 않습니다. 예: https://pf.kakao.com/_xxxxx"
    exit 1
}
if ($NewLink.Contains('"')) {
    Write-Host "링크에 큰따옴표(`")를 포함할 수 없습니다."
    exit 1
}

$markerPattern = '<a\b(?=[^>]*\bdata-consult-link\b)[^>]*?href="([^"]+)"'
$domainPattern = 'href="(https?://(?:open\.kakao\.com|pf\.kakao\.com|qr\.kakao\.com|han\.gl)/[^"]*)"'
$iconPattern = '<a\b[^>]*?href="(https?://[^"]+)"[^>]*>\s*<i class="fas fa-comment"'

# OldLink를 지정하지 않았으면 현재 파일들에서 실제 쓰이는 상담 링크를 자동으로 찾는다.
if ($OldLink) {
    $oldLinks = @($OldLink.Trim())
} else {
    $found = @{}
    foreach ($file in $files) {
        $text = [System.IO.File]::ReadAllText($file.FullName, $encoding)
        foreach ($pattern in @($markerPattern, $domainPattern, $iconPattern)) {
            foreach ($m in [regex]::Matches($text, $pattern)) {
                $link = $m.Groups[1].Value
                if ($found.ContainsKey($link)) { $found[$link]++ } else { $found[$link] = 1 }
            }
        }
    }
    $oldLinks = @($found.Keys | Where-Object { $_ -ne $NewLink })
    if ($found.Count -eq 0) {
        Write-Host "현재 파일에서 변경할 상담 링크를 찾지 못했습니다. -OldLink 옵션으로 직접 지정해주세요."
        exit 1
    }
    if ($oldLinks.Count -eq 0) {
        Write-Host "현재 링크와 새 링크가 동일합니다. 변경할 내용이 없습니다."
        exit 0
    }
    Write-Host "현재 상담 링크 자동 감지:"
    foreach ($link in $oldLinks) { Write-Host "  - $link" }
}

if ($oldLinks -contains $NewLink) {
    Write-Host "현재 링크와 새 링크가 동일합니다. 변경할 내용이 없습니다."
    exit 0
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $encoding)
    $count = 0

    foreach ($link in $oldLinks) {
        # 링크 뒤에 다른 문자가 이어지는 경우(더 긴 URL의 일부)는 건드리지 않도록 따옴표까지 포함해 치환
        $pattern = [regex]::Escape('"' + $link + '"')
        $count += ([regex]::Matches($content, $pattern)).Count
        $content = $content.Replace('"' + $link + '"', '"' + $NewLink + '"')
    }

    if ($count -gt 0) {
        $totalFiles++
        $totalReplacements += $count
        if ($DryRun) {
            Write-Host "[DRY-RUN] $($file.Name): $count 건 변경 예정"
        } else {
            [System.IO.File]::WriteAllText($file.FullName, $content, $encoding)
            Write-Host "변경 완료: $($file.Name) ($count 건)"
        }
    }
}

Write-Host ""
if ($DryRun) {
    Write-Host "[DRY-RUN] 총 $totalFiles 개 파일, $totalReplacements 건 변경 예정 (실제 파일은 수정되지 않았습니다)"
} else {
    Write-Host "총 $totalFiles 개 파일, $totalReplacements 건 변경 완료 -> $NewLink"
}
