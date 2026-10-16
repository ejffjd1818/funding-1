/**
 * OhMyCompany Funding Page Prototype Script
 * 
 * 1. 확실한 탭 전환: '프로젝트 소개' / '커뮤니티' / '후원자'
 * 2. 커뮤니티 내부 서브탭 전환: '최근 소식' / 'Q&A' / '프로젝트 후기'
 * 3. 버튼 호버 상태 우선 (클릭 시 페이지 이탈 방지)
 * 4. 빈 이미지 슬롯 클릭 시 로컬 사진 바로 넣어보기 (실시간 이미지 미리보기 기능)
 * 5. 상단 공지 배너 닫기 & 스크롤 탑 이동
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Primary Tabs (프로젝트 소개 / 커뮤니티 / 후원자)
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const stickyTabsNav = document.getElementById('mainTabsNav');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = btn.getAttribute('data-tab');

      // Update Tab Button Active State
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update Panel Active State
      tabPanels.forEach(panel => {
        if (panel.id === targetTabId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Adjust scroll position if below sticky bar
      if (stickyTabsNav) {
        const navRect = stickyTabsNav.getBoundingClientRect();
        if (navRect.top < 70) {
          window.scrollTo({
            top: stickyTabsNav.offsetTop - 72,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // =========================================================================
  // 2. Community Sub-Tabs (최근 소식 / Q&A / 후기)
  // =========================================================================
  const subTabButtons = document.querySelectorAll('.subtab-btn');
  const subPanels = document.querySelectorAll('.community-subpanel');

  subTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSubId = btn.getAttribute('data-subtab');

      subTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      subPanels.forEach(panel => {
        if (panel.id === targetSubId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // =========================================================================
  // 3. 사진 슬롯 클릭 시 로컬 이미지 선택 및 실시간 미리보기 기능
  //    (사용자가 브라우저에서 바로 사진을 넣어 테스트할 수 있는 편의 기능)
  // =========================================================================
  const dropSlots = document.querySelectorAll('.drop-image-slot');

  dropSlots.forEach(slot => {
    const fileInput = slot.querySelector('.slot-file-input');

    if (fileInput) {
      // Slot click opens file dialog
      slot.addEventListener('click', (e) => {
        // If clicking on a delete button, don't reopen dialog
        if (e.target.closest('.btn-remove-preview')) return;
        fileInput.click();
      });

      // When file is chosen
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            // Remove previous preview if exists
            let existingImg = slot.querySelector('.uploaded-preview-img');
            if (existingImg) existingImg.remove();
            let existingRemoveBtn = slot.querySelector('.btn-remove-preview');
            if (existingRemoveBtn) existingRemoveBtn.remove();

            // Create new preview image
            const img = document.createElement('img');
            img.src = loadEvent.target.result;
            img.className = 'uploaded-preview-img';
            img.alt = '등록된 이미지';

            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-remove-preview';
            removeBtn.innerHTML = '✕ 사진 제거';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '12px';
            removeBtn.style.right = '12px';
            removeBtn.style.zIndex = '10';
            removeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            removeBtn.style.color = '#ffffff';
            removeBtn.style.padding = '4px 10px';
            removeBtn.style.borderRadius = '4px';
            removeBtn.style.fontSize = '12px';
            removeBtn.style.fontWeight = '600';
            removeBtn.style.cursor = 'pointer';

            removeBtn.addEventListener('click', (removeEvent) => {
              removeEvent.stopPropagation();
              img.remove();
              removeBtn.remove();
              fileInput.value = '';
              const placeholder = slot.querySelector('.media-frame-placeholder');
              if (placeholder) placeholder.style.opacity = '1';
            });

            // Hide placeholder text partially
            const placeholder = slot.querySelector('.media-frame-placeholder');
            if (placeholder) placeholder.style.opacity = '0';

            slot.appendChild(img);
            slot.appendChild(removeBtn);

            showToast('사진이 등록되었습니다. (우측 상단 버튼으로 제거 가능)');
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  // =========================================================================
  // 4. 일반 버튼 호버 전용 및 이탈 방지 피드백
  // =========================================================================
  const hoverOnlyBtns = document.querySelectorAll('.btn-proto-hover, .btn-open-funding, .header-login-btn');
  hoverOnlyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.style.transform = 'scale(0.97)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
      showToast('시안 프레임 모드: 버튼 호버 스타일 확인용입니다.');
    });
  });

  // Toast Helper
  let toastTimer = null;
  function showToast(msg) {
    let toast = document.getElementById('protoToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'protoToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '80px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.backgroundColor = 'rgba(33, 37, 41, 0.9)';
      toast.style.color = '#ffffff';
      toast.style.padding = '10px 22px';
      toast.style.borderRadius = '24px';
      toast.style.fontSize = '13.5px';
      toast.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
      toast.style.zIndex = '9999';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.25s ease';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
  }

  // =========================================================================
  // 5. 상단 공지 배너 닫기 & 스크롤 탑 이동 & 메이커 더보기
  // =========================================================================
  const btnBannerClose = document.getElementById('btnBannerClose');
  const topBanner = document.getElementById('topBanner');
  if (btnBannerClose && topBanner) {
    btnBannerClose.addEventListener('click', () => {
      topBanner.style.transition = 'all 0.3s ease';
      topBanner.style.opacity = '0';
      topBanner.style.height = '0';
      topBanner.style.overflow = 'hidden';
      setTimeout(() => topBanner.remove(), 300);
    });
  }

  const btnScrollTop = document.getElementById('btnScrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnScrollTop.classList.add('visible');
    } else {
      btnScrollTop.classList.remove('visible');
    }
  });
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const btnMakerExpand = document.getElementById('btnMakerExpand');
  const makerBio = document.querySelector('.maker-bio-text');
  if (btnMakerExpand && makerBio) {
    let expanded = false;
    btnMakerExpand.addEventListener('click', (e) => {
      e.preventDefault();
      expanded = !expanded;
      if (expanded) {
        makerBio.style.webkitLineClamp = 'unset';
        btnMakerExpand.textContent = '접기 ∧';
      } else {
        makerBio.style.webkitLineClamp = '4';
        btnMakerExpand.textContent = '더보기 ⌵';
      }
    });
  }

});
