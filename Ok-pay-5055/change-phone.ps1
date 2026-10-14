# 전화번호 일괄 변경 스크립트
# 사용법: .\change-phone.ps1 -NewNumber "010-1234-5678"
#
# 폴더 안 html 파일들을 스캔해서 "현재 쓰이고 있는 전화번호"를 자동으로 찾아
# 새 번호로 전부 바꿔줍니다. (매번 다시 실행해도 항상 현재 번호 기준으로 동작)
# - tel:3114-1777 (플로팅 버튼 번호)는 항상 예외 처리하여 절대 건드리지 않음
# - 특정 옛 번호만 지정해서 바꾸고 싶으면 -OldNumber 옵션으로 직접 지정 가능

param(
    [Parameter(Mandatory = $true)]
    [string]$NewNumber,
    [string]$OldNumber,
    [switch]$DryRun
)

$ExcludeNumber = "3114-1777"
$dir = $PSScriptRoot
$files = Get-ChildItem -Path $dir -Filter *.html
$encoding = New-Object System.Text.UTF8Encoding($false)

# OldNumber를 지정하지 않았으면 현재 파일들에서 실제 쓰이는 번호를 자동으로 찾는다.
if (-not $OldNumber) {
    $found = @{}
    foreach ($file in $files) {
        $text = [System.IO.File]::ReadAllText($file.FullName, $encoding)
        foreach ($m in [regex]::Matches($text, 'tel:(\d{2,4}-\d{3,4}-\d{4})')) {
            $num = $m.Groups[1].Value
            if ($num -ne $ExcludeNumber) {
                if ($found.ContainsKey($num)) { $found[$num]++ } else { $found[$num] = 1 }
            }
        }
    }
    if ($found.Count -eq 0) {
        Write-Host "현재 파일에서 변경할 전화번호를 찾지 못했습니다. -OldNumber 옵션으로 직접 지정해주세요."
        exit 1
    }
    $OldNumber = ($found.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Key
    Write-Host "현재 번호 자동 감지: $OldNumber"
}

if ($OldNumber -eq $NewNumber) {
    Write-Host "현재 번호와 새 번호가 동일합니다. 변경할 내용이 없습니다."
    exit 0
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $encoding)
    $original = $content

    $count = ([regex]::Matches($original, [regex]::Escape($OldNumber))).Count
    $content = $content -replace [regex]::Escape($OldNumber), $NewNumber

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
    Write-Host "총 $totalFiles 개 파일, $totalReplacements 건 변경 완료 -> $NewNumber"
}
Write-Host "참고: tel:$ExcludeNumber (플로팅 버튼 번호)는 변경되지 않았습니다."
