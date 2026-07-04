'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react';

interface Message { id: number; sender: 'user' | 'ai'; text: string; }
interface CategoryDetail { num: string; title: string; subtitle: string; content: React.ReactNode; }

export default function LincoUltimatePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'chat' | 'overview' | 'guide' | 'roadmap' | 'settings'>('chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetail, setActiveDetail] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: '반갑습니다!일상 속 똑똑한 조력자, 링코입니다. 무엇이든 편하게 물어보세요!' }
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 📝 [완벽 복원] 원래 HTML에 들어있던 6대 프레임워크 백서 상세 콘텐츠 전체 반영
  const CATEGORY_DATA: Record<string, CategoryDetail> = {
    admin: { 
      num: "01",
      title: "스마트 행정 및 민원 도큐멘테이션 백서",
      subtitle: "정부24 및 주요 기관 연계 원스톱 서류 발급 체계 및 신고 가이드라인",
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-300 font-light">
          <p className="text-lg leading-relaxed text-slate-400 font-normal mb-6">본 프레임워크는 대국민 행정 기관 방문 없는 무인/비대면 원스톱 민원 처리를 표준화합니다.</p>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-slate-100 block text-base font-bold mb-1">정부24 비대면 발급 고도화</strong>공동인증서 및 간편인증 기반의 동기화를 통해 주민등록등본, 초본, 건축물대장 등 핵심 민원서류를 즉시 PDF로 변환 및 모바일 지갑으로 송출하는 시스템 가이드라인을 정립합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">가족관계증명서 및 법원 연계</strong>대법원 전자의료가족관계등록시스템과의 API 연결을 인터페이스화하여 온디맨드 형태의 무료 증명 공급 인프라를 확충합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">모바일 신분증 및 자격 검증 패스</strong>운전면허증 및 주민등록증의 분실 리스크를 차단하기 위한 DID 블록체인 기반 모바일 증명 모듈을 장착하여 오프라인 신원 확인 절차를 간소화합니다.</li>
          </ul>
        </div>
      )
    },
    housing: { 
      num: "02",
      title: "청년 주거 안심 보호 프로토콜 백서",
      subtitle: "사회초년생 자산 보호를 위한 전세사기 원천 예방 및 안심 특약 매칭",
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-300 font-light">
          <p className="text-lg leading-relaxed text-slate-400 font-normal mb-6">사회초년생 및 청년 가구의 부동산 정보 비대칭성을 해결하고 보증금 유실 위험을 차단하는 자산 보호 규격입니다.</p>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-slate-100 block text-base font-bold mb-1">계약 전 실시간 권리 분석</strong>대법원 인터넷등기소 API 연계를 유도하여 등기부등본의 갑구(소유권 래포) 및 을구(근저당 설정)를 자동 트래킹하고, 매물 가치 대비 부채 비율이 70%를 상회할 시 경고 피드백을 전달합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">HUG 전세보증보험 및 안심특약 빌더</strong>주택도시보증공사의 가입 승인 요건을 시뮬레이션하고, 임대인의 악성 임대인 명부 등록 여부를 사전 대조합니다. 계약서 특약란에 "전세자금대출 미승인 시 계약은 무효로 하고 계약금은 즉시 반환한다" 등의 법적 효력 안심 문구를 자동 생성합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">주택임대차 신고 및 확정일자 원스톱 패스</strong>국토교통부 거래신고 시스템과 네이티브 동기화를 지원하여 이사 당일 주민센터 방문 없이 확정일자 부여 및 전입신고를 모바일로 일괄 접수하여 우선변제권을 실시간으로 확보합니다.</li>
          </ul>
        </div>
      )
    },
    finance: { 
      num: "03", 
      title: "디지털 금융 보안 및 자산 트래킹 엔진 백서", 
      subtitle: "스미싱 차단 체계 구축 및 숨은 국가 환급금 · 카드 포인트 일괄 매칭", 
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-300 font-light">
          <p className="text-lg leading-relaxed text-slate-400 font-normal mb-6">지능화되는 보이스피싱 금융 피해를 원천 차단하고 숨은 미청구 자산을 일괄 복원하는 금융 안전망입니다.</p>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-slate-100 block text-base font-bold mb-1">악성 앱 및 스미싱 링크 원격 디텍팅</strong>출처가 불분명한 APK 파일 설치 및 금융기관 사칭 문자 메시지의 URL 패턴을 실시간으로 분석하여 탐지 시 즉각적인 실행 차단 안내를 전송합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">미청구 국가 환급금 및 과오납금 일괄 조회</strong>삼쩜삼 방식의 세금 환급 가이드를 넘어 국세청 홈택스, 행안부 위택스, 국민건강보험 환급금 API를 다이렉트로 매칭하여 사용자가 인지하지 못한 숨은 과오납 행정 비용을 찾아 정산합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">흩어진 카드 포인트 및 여신금융 자산 통합</strong>여신금융협회 통합조회 모듈을 스크래핑 방식으로 가이드하여 여러 카드사에 분산된 잔여 포인트를 단 하나의 대표 계좌로 일괄 현금화 입금 처리하는 알고리즘을 제안합니다.</li>
          </ul>
        </div>
      )
    },
    eco: { 
      num: "04", 
      title: "친환경 자원 순환 가이드 인프라 백서", 
      subtitle: "혼동하기 쉬운 분리배출 규정 확립 및 대형 폐가전 무상 수거 연계", 
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-300 font-light">
          <p className="text-lg leading-relaxed text-slate-400 font-normal mb-6">복잡하고 혼동하기 쉬운 지자체별 폐기물 배출 규정을 인공지능 기반으로 시각화하여 과태료 부과를 방지합니다.</p>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-slate-100 block text-base font-bold mb-1">애매한 품목 분리배출 AI 가이드라인</strong>씻어도 지워지지 않는 컵라면 용기(일반쓰레기), 거울 및 도자기류(불연성 마대), 깨진 유리 대처법 등 환경부 공식 매뉴얼을 챗봇 형태로 연동하여 즉각적인 배출 카테고리를 지정합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">대형 폐가전 및 가구 무상 배출 솔루션</strong>한국전자제품자원순환공제조합(내수거형) 시스템과 연계하여 냉장고, 세탁기 등 대형 가전을 스티커 구입 비용 없이 기사 방문 수거로 처리하는 루트를 안내합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">지자체 대형 폐기물 스티커 모바일 발행</strong>침대, 책상 등 가구류 배출 시 구청 방문 없이 모바일로 간편 결제 후 바코드가 포함된 신고 필증을 출력하거나 번호를 기재하여 배출하는 행정 편의를 확보합니다.</li>
          </ul>
        </div>
      )
    },
    travel: { 
      num: "05", 
      title: "지능형 교통 및 모빌리티 최적화 백서", 
      subtitle: "K-패스 교통비 환급, 수하물 보안 규정 및 과태료 결제 구조 확립", 
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-300 font-light">
          <p className="text-lg leading-relaxed text-slate-400 font-normal mb-6">전국 단위의 교통 인프라 편의성을 확보하고, 항공 및 도로 네트워크에서 발생하는 행정 비용과 위반 리스크를 관리합니다.</p>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-slate-100 block text-base font-bold mb-1">K-패스 및 광역 교통비 환급 자동화</strong>국토교통부 대중교통비 환급 플랫폼 고도화 가이드에 맞춰 월별 대중교통 이용 횟수 및 청년/저소득층 우대 적립률(20%~53%)의 최적 정산 트래킹 뷰를 구현합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">국제선 항공 보안 수하물 원격 통제</strong>IATA 규격 기준 리튬 보조배터리, 라이터, 전자담배의 위탁 수하물 반입 불허 지침 및 기내 휴대 필수 규정, 액체류 100ml 용기 제한 룰을 탑승 전 체크리스트로 자동 빌드합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">경찰청 이파인(EFINE) 실시간 단속 조회</strong>교통민원24 네트워크와 상시 매칭되어 무인 단속 카메라에 감지된 제한 속도/신호 위반 과태료 및 범칙금을 즉시 고지하고 미납 고속도로 통행료와 함께 디지털로 원스톱 결제 처리합니다.</li>
          </ul>
        </div>
      )
    },
    health: { 
      num: "06", 
      title: "의료 헬스케어 및 라이프 가드 파이프라인 백서", 
      subtitle: "실시간 야간의료 매칭, 종이 없는 실비 청구 및 건강검진 인프라", 
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-300 font-light">
          <p className="text-lg leading-relaxed text-slate-400 font-normal mb-6">야간·휴일 의료 공백을 최소화하고 보건의료 데이터를 개인 주도형으로 안전하게 관리하는 디지털 헬스 파이프라인입니다.</p>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-slate-100 block text-base font-bold mb-1">달빛어린이병원 및 응급의료 네트워크 매칭</strong>중앙응급의료센터(E-Gen) API를 가동하여 심야 시간대 운영 중인 인근 소아과 및 야간 약국의 대기 현황과 진료 가능 여부를 실시간 지도로 라우팅합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">실손의료보험 종이 없는 간편 청구</strong>병원에서 복잡한 영수증과 세부내역서를 종이로 발급받을 필요 없이, 마이데이터 체계를 활용해 터치 몇 번으로 보험사에 디지털 청구서를 전송하는 프로토콜을 제시합니다.</li>
            <li><strong className="text-slate-100 block text-base font-bold mb-1">국민건강보험 공단 검진 결과 데이터 마이닝</strong>과거 10년간 진행된 국가 일반 건강검진 결과를 연동하여 혈압, 혈당, 콜레스테롤 추이를 시각화하고 대사증후군 위험도를 예측하는 맞춤 헬스 피드를 형성합니다.</li>
          </ul>
        </div>
      )
    }
  };

  // 안전 모드용 시뮬레이터 로직
  const executeSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInput('');
    setIsLoading(true);

   const executeSend = async (text: string) => {
  if (!text.trim()) return;

  // 1. 유저 메시지 추가
  const userMsgId = Date.now();
  setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
  setIsLoading(true);

  try {
    // 2. Dify API 호출
    // * 주의: 프론트엔드에서 API 키를 직접 노출하는 것은 보안상 위험하므로, 
    //   실제 서비스 시에는 Next.js API Routes(/api/chat 등)를 거쳐서 호출하는 것을 권장합니다.
    const response = await fetch('https://api.dify.ai/v1', {
      method: 'POST',
      headers: {
        'Authorization': 'app-9We3jSI8ayICovlytatAxpy7', // 발급받은 Dify API Key 입력
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: text,
        user: "linco-user", // 사용자를 식별할 수 있는 임의의 값
        response_mode: "blocking" // 스트리밍이 아닌 한 번에 답변을 받는 모드
      }),
    });

    if (!response.ok) {
      throw new Error('API 요청에 실패했습니다.');
    }

    const data = await response.json();
    
    // 3. AI 답변 추가 (Dify의 응답 구조에 맞게 추출)
    const aiAnswer = data.answer || "답변을 가져오지 못했습니다.";
    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiAnswer }]);

  } catch (error) {
    console.error('Error sending message:', error);
    setMessages(prev => [
      ...prev, 
      { id: Date.now() + 1, sender: 'ai', text: '⚠️ 에러가 발생했습니다. API 연결 상태를 확인해 주세요.' }
    ]);
  } finally {
    setIsLoading(false);
  }
};
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeSend(input);
  };

  return (
    <div className={`min-h-screen flex w-screen h-screen overflow-hidden antialiased transition-colors duration-300 tracking-tight font-sans ${theme === 'dark' ? 'bg-[#0b0f19] text-[#f8fafc]' : 'bg-[#f1f5f9] text-[#0f172a]'}`}>
      
      {/* HTML 표준 link 아이콘 및 웹폰트 안전하게 주입 */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" />
      
      <style dangerouslySetInnerHTML={{__html: `
        body, html, * {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
      `}} />

      {/* LEFT SIDEBAR DESIGN */}
      <aside className={`w-[280px] p-10 flex flex-col justify-between border-r shrink-0 z-50 h-full transition-all ${theme === 'dark' ? 'bg-[#111827] border-[#374151] shadow-[4px_0_20px_rgba(0,0,0,0.5)]' : 'bg-white border-[#cbd5e1] shadow-[4px_0_15px_rgba(0,0,0,0.03)]'}`}>
        <div className="flex flex-col gap-10">
          <div className="font-bold text-2xl tracking-wide text-current">
            ⚙️ LINCO
            <span className="block mt-1.5 font-normal text-xs text-[#94a3b8] tracking-widest uppercase">Strategic Framework</span>
          </div>
          <nav className="flex flex-col gap-2.5">
            <button type="button" onClick={() => { setActiveTab('chat'); setActiveDetail(null); }} className={`w-full text-left p-3.5 px-4 font-semibold text-[14.5px] border rounded-xl transition-all flex items-center gap-3 cursor-pointer ${activeTab === 'chat' ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white border-transparent shadow-[0_4px_14px_rgba(6,182,212,0.3)] scale-[1.02]' : 'bg-transparent text-[#94a3b8] border-transparent hover:bg-slate-500/10 hover:text-current'}`}>
              <span>AI 비서</span>
            </button>
            <button type="button" onClick={() => { setActiveTab('guide'); setActiveDetail(null); }} className={`w-full text-left p-3.5 px-4 font-semibold text-[14.5px] border rounded-xl transition-all flex items-center gap-3 cursor-pointer ${activeTab === 'guide' ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white border-transparent shadow-[0_4px_14px_rgba(6,182,212,0.3)] scale-[1.02]' : 'bg-transparent text-[#94a3b8] border-transparent hover:bg-slate-500/10 hover:text-current'}`}>
              <span>질문 가이드 및 설명서</span>
            </button>
            <button type="button" onClick={() => { setActiveTab('overview'); setActiveDetail(null); }} className={`w-full text-left p-3.5 px-4 font-semibold text-[14.5px] border rounded-xl transition-all flex items-center gap-3 cursor-pointer ${activeTab === 'overview' ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white border-transparent shadow-[0_4px_14px_rgba(6,182,212,0.3)] scale-[1.02]' : 'bg-transparent text-[#94a3b8] border-transparent hover:bg-slate-500/10 hover:text-current'}`}>
              <span>서비스 개요</span>
            </button>
          </nav>
        </div>
        <div className="flex flex-col gap-2.5">
          <button type="button" onClick={() => { setActiveTab('roadmap'); setActiveDetail(null); }} className={`w-full text-left p-3.5 px-4 font-semibold text-[14.5px] border rounded-xl transition-all flex items-center gap-3 cursor-pointer ${activeTab === 'roadmap' ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white border-transparent scale-[1.02]' : 'bg-transparent text-[#94a3b8] border-transparent hover:bg-slate-500/10 hover:text-current'}`}>
            <span>앞으로의 로드맵</span>
          </button>
          <button type="button" onClick={() => { setActiveTab('settings'); setActiveDetail(null); }} className={`w-full text-left p-3.5 px-4 font-semibold text-[14.5px] border rounded-xl transition-all flex items-center gap-3 cursor-pointer ${activeTab === 'settings' ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white border-transparent scale-[1.02]' : 'bg-transparent text-[#94a3b8] border-transparent hover:bg-slate-500/10 hover:text-current'}`}>
            <span>설정</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 h-full relative flex flex-col overflow-hidden">
        
        {/* AI CHAT SECTION */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full w-full justify-between">
            <div className="flex-1 p-10 overflow-y-auto flex flex-col gap-5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex max-w-[80%] p-4.5 px-6 rounded-2xl text-[15.5px] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] text-white self-end font-medium rounded-tr-none' : `self-start border rounded-tl-none ${theme === 'dark' ? 'bg-[#1f2937] border-[#374151] text-slate-100' : 'bg-white border-[#cbd5e1] text-[#0f172a]'}`}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && <div className="self-start p-3 px-5 text-sm rounded-xl animate-pulse bg-slate-500/10 text-slate-400 font-medium">LINCO 분석 엔진 가동 중...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* 새 가이드북 기반 맞춤형 키워드 해시태그 */}
            <div className="flex flex-wrap gap-2.5 px-10 mb-5">
              {[
                { label: 'POLICY 01 금융·자산 형성', query: 'POLICY 01 금융·자산 형성 분야 핵심 복지 제도의 소득 및 재산 기준을 알려줘' },
                { label: '메이커 스페이스 시제품 지원', query: '메이커 스페이스 시제품 제작지원 정책의 제출 서류가 무엇인지 5단계 서식으로 알려줘' },
                { label: '스타트업 해외진출 지원', query: 'POLICY 49 청년 스타트업 해외진출 엑셀러레이팅 지원 내용과 신청 방법을 설명해줘' }
              ].map(tag => (
                <button key={tag.label} type="button" onClick={() => executeSend(tag.query)} className="text-[13px] font-semibold border rounded-full px-4 py-2.5 bg-[#1f2937] text-[#38bdf8] border-[#374151] hover:text-white cursor-pointer transition-all"># {tag.label}</button>
              ))}
            </div>

            {/* CONTROL PANEL & INPUT ROW */}
            <div className={`p-6 px-10 flex flex-col gap-4 border-t backdrop-blur-md ${theme === 'dark' ? 'bg-[#111827]/90 border-[#374151]' : 'bg-white/90 border-[#cbd5e1]'}`}>
              <button type="button" onClick={() => executeSend("POLICY 01 금융·자산 형성 분야 핵심 복지 제도의 소득 및 재산 기준을 알려줘")} className="w-full p-4 font-bold rounded-xl text-white bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] flex items-center justify-center gap-2 cursor-pointer transition-all">
                <i className="fa-solid fa-microphone text-base"></i> 가이드북 기반 원클릭 시뮬레이션 질문 입력
              </button>
              <form onSubmit={handleFormSubmit} className="flex gap-3">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="새 가이드북의 50선 복지 정책을 입력해 보세요..." className="flex-1 p-4 px-5 rounded-xl border bg-[#0b0f19] text-white border-[#374151] outline-none" />
                <button type="submit" className="p-4 px-8 font-bold border rounded-xl bg-[#1f2937] text-[#38bdf8] border-[#374151] cursor-pointer">전송</button>
              </form>
            </div>
          </div>
        )}

        {/* 질문 가이드 및 사용 설명서 탭 */}
        {activeTab === 'guide' && (
          <div className="w-full h-full p-12 box-border overflow-y-auto max-w-4xl">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <i className="fa-solid fa-book-open text-[#38bdf8]"></i> LINCO AI 사용 설명서
            </h1>
            <span className="text-[#94a3b8] text-[15px] font-medium block mt-1.5 mb-10">링코에게 어떤 질문을 던질 수 있고, 어떤 완벽한 답변을 보장받는지 안내해 드립니다.</span>

            <div className="space-y-8">
              <div className={`p-6 border rounded-2xl ${theme === 'dark' ? 'bg-[#1f2937] border-[#374151]' : 'bg-white border-[#cbd5e1]'}`}>
                <h3 className="text-xl font-bold mb-3 text-cyan-400 flex items-center gap-2">
                  <i className="fa-solid fa-circle-question"></i> 무엇을 물어볼 수 있나요?
                </h3>
                <p className="text-[#94a3b8] text-[15px] leading-relaxed mb-4">
                  현재 링코에는 대한민국 청년 및 사회초년생을 위한 **총 50가지의 알짜배기 정부 핵심 정책 가이드북** 데이터가 실시간 탑재되어 있습니다. 주거, 목돈, 일자리, 금융 보안 등 전 영역의 질문에 최적화되어 있습니다.
                </p>
                <div className="bg-[#0b0f19]/40 p-4 rounded-xl border border-slate-700/40 space-y-2">
                  <div className="text-[14.5px] text-slate-300"><strong className="text-[#38bdf8] font-semibold">💡 POLICY 01:</strong> "금융·자산 형성 분야 핵심 복지제도 조건이 뭐야?"</div>
                  <div className="text-[14.5px] text-slate-300"><strong className="text-[#38bdf8] font-semibold">💡 POLICY 48:</strong> "메이커 스페이스 시제품 제작지원 정책의 제출 서류가 뭐야?"</div>
                </div>
              </div>

              <div className={`p-6 border rounded-2xl ${theme === 'dark' ? 'bg-[#1f2937] border-[#374151]' : 'bg-white border-[#cbd5e1]'}`}>
                <h3 className="text-xl font-bold mb-3 text-emerald-400 flex items-center gap-2">
                  <i className="fa-solid fa-circle-check"></i> 어떤 형태로 답변해 주나요?
                </h3>
                <p className="text-[#94a3b8] text-[15px] leading-relaxed mb-4">
                  링코는 가이드북에 준하는 **"표준 5단계 정밀 서식 구조"**에 맞춰 가독성 높게 정보를 정리하여 표출합니다.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-[13.5px] font-medium text-slate-200">
                  <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl">1. 지원 대상</div>
                  <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl">2. 소득 및 재산</div>
                  <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl">3. 지원 내용</div>
                  <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl">4. 신청 방법</div>
                  <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl">5. 제출 서류</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICE OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="w-full h-full p-12 box-border overflow-y-auto relative">
            {!activeDetail ? (
              <>
                <h1 className="text-3xl font-bold tracking-tight">Service Overview</h1>
                <span className="text-[#94a3b8] text-[15px] font-medium block mt-1.5 mb-10">일상의 핵심 난제 해결을 위한 6대 프레임워크 백서</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(CATEGORY_DATA).map((key) => (
                    <div key={key} onClick={() => setActiveDetail(key)} className={`border p-8 rounded-2xl cursor-pointer flex flex-col justify-between transition-all duration-300 relative group hover:-translate-y-2 hover:border-[#38bdf8] ${theme === 'dark' ? 'bg-[#1f2937] border-[#374151] shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 'bg-white border-[#cbd5e1] shadow-[0_4px_15px_rgba(0,0,0,0.02)]'}`}>
                      <div className="absolute top-0 left-0 w-full h-[4px] bg-[#3b82f6] rounded-t-2xl"></div>
                      <div>
                        <span className="font-bold text-sm text-[#38bdf8] mb-4 block font-mono tracking-wider">{CATEGORY_DATA[key].num}</span>
                        <h3 className="text-xl font-bold mb-3.5 leading-snug text-current tracking-tight">{CATEGORY_DATA[key].title.replace(" 백서", "")}</h3>
                        <p className="text-sm text-[#94a3b8] leading-relaxed mb-6 font-normal line-clamp-2">{CATEGORY_DATA[key].subtitle}</p>
                      </div>
                      <div className="text-[13px] font-bold text-[#38bdf8] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">전략 백서 보기 &rarr;</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-w-4xl mx-auto py-4">
                <button onClick={() => setActiveDetail(null)} className="text-[14.5px] text-[#94a3b8] hover:text-current font-semibold flex items-center gap-2 mb-8 bg-transparent border-none cursor-pointer">
                  &larr; 목록 대시보드로 돌아가기
                </button>
                <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]">{CATEGORY_DATA[activeDetail].title}</h2>
                <div className="text-slate-400 font-medium mb-8 pb-5 border-b border-slate-700/60">{CATEGORY_DATA[activeDetail].subtitle}</div>
                <div>{CATEGORY_DATA[activeDetail].content}</div>
              </div>
            )}
          </div>
        )}

        {/* ROADMAP DESIGN SYSTEM */}
        {activeTab === 'roadmap' && (
          <div className="p-12 box-border h-full overflow-y-auto flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tight">링코 향후 비전 및 업데이트 로드맵</h1>
            <span className="text-[#94a3b8] text-[15px] font-medium block mt-1.5 mb-10">플랫폼의 지속 가능한 진화 방향성을 기술 타임라인 기반으로 공개합니다.</span>
            
            <div className="flex flex-col gap-6 relative pl-8 border-l-2 border-slate-700/40 max-w-3xl ml-2">
              {[
                { phase: 'Phase 1 (Near-Term Vision)', title: '공공 API 가이드 고도화 및 실시간 동기화', desc: '정부24 및 대법원 등록 시스템의 연계 데이터 범위를 넓혀 가이드라인의 정확도를 실시간 수준으로 끌어올릴 예정입니다.' },
                { phase: 'Phase 2 (Mid-Term Vision)', title: '소외계층 전용 초지능형 AI 보이스 비서 도입', desc: '텍스트 입력이 어려운 고령층이나 다문화 가정을 위해 자연어 대화만으로 복잡한 서류 신청 및 민원 처리를 에스코트하는 음성 대화형 엔진을 결합합니다.' }
              ].map((node) => (
                <div key={node.phase} className="p-6 border rounded-2xl relative bg-[#1f2937] border-[#374151]">
                  <span className="text-xs font-bold text-[#38bdf8] uppercase block mb-1.5 font-mono tracking-wider">{node.phase}</span>
                  <h4 className="text-xl font-bold mb-3 text-current">{node.title}</h4>
                  <p className="text-[15px] text-[#94a3b8] leading-relaxed font-normal">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS PANEL */}
        {activeTab === 'settings' && (
          <div className="p-12 box-border h-full overflow-y-auto flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tight">시스템 디자인 및 환경 설정</h1>
            <div className={`p-6 border rounded-2xl max-w-xl ${theme === 'dark' ? 'bg-[#1f2937] border-[#374151]' : 'bg-white border-[#cbd5e1]'}`}>
              <div className="text-base font-bold mb-4 flex items-center gap-2"><i className="fa-solid fa-palette text-[#38bdf8]"></i> 시각 테마 디자인 모드</div>
              <div className="flex gap-4">
                <button onClick={() => setTheme('dark')} className="flex-1 p-3.5 font-bold rounded-xl border bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white border-transparent">Dark Premium</button>
                <button onClick={() => setTheme('light')} className="flex-1 p-3.5 font-bold rounded-xl border bg-slate-600 text-white border-transparent">Light Elegant</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}