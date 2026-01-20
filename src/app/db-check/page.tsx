'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Database, AlertTriangle } from 'lucide-react';

export default function DBCheckPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [envStatus, setEnvStatus] = useState({
        url: false,
        key: false,
    });
    const [tableInfo, setTableInfo] = useState<string>('');

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        setStatus('loading');
        setMessage('연결 확인 중...');

        // 1. 환경변수 확인
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        setEnvStatus({
            url: !!(url && url.startsWith('http')),
            key: !!(key && key.length > 0),
        });

        if (!url || !url.startsWith('http') || !key) {
            setStatus('error');
            setMessage('환경변수가 올바르게 설정되지 않았습니다.');
            return;
        }

        try {
            // 2. 실제 DB 쿼리 테스트 (restaurants 테이블 조회)
            // count만 가져와서 권한/연결 확인
            const { count, error, status: httpStatus } = await supabase
                .from('restaurants')
                .select('*', { count: 'exact', head: true });

            if (error) {
                throw error;
            }

            setStatus('success');
            setMessage(`연결 성공! (Status: ${httpStatus})`);
            setTableInfo(`restaurants 테이블 레코드 수: ${count}개`);

        } catch (err: any) {
            console.error('DB Check Error:', err);
            setStatus('error');
            setMessage(err.message || '연결 실패');
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 p-6 flex flex-col items-center justify-center text-brown-800">
            <div className="w-full max-w-md bg-white rounded-2xl border border-cream-200 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-cream-100 pb-4">
                    <Database className="text-orange-500" size={24} />
                    <h1 className="text-xl font-bold">DB 연결 테스트</h1>
                </div>

                <div className="space-y-6">
                    {/* 환경변수 상태 */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-brown-600">환경변수 설정</h2>
                        <div className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
                            <span className="text-sm">Supabase URL</span>
                            {envStatus.url ? (
                                <CheckCircle className="text-green-500" size={18} />
                            ) : (
                                <XCircle className="text-red-500" size={18} />
                            )}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
                            <span className="text-sm">Anon Key</span>
                            {envStatus.key ? (
                                <CheckCircle className="text-green-500" size={18} />
                            ) : (
                                <XCircle className="text-red-500" size={18} />
                            )}
                        </div>
                    </div>

                    {/* 연결 상태 */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-brown-600">연결 테스트 결과</h2>
                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${status === 'loading' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                status === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                                    'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            {status === 'loading' && <div className="animate-spin text-xl">⏳</div>}
                            {status === 'success' && <CheckCircle size={24} />}
                            {status === 'error' && <AlertTriangle size={24} />}

                            <div className="flex-1">
                                <p className="font-bold">{status === 'loading' ? '테스트 중...' : status === 'success' ? '성공' : '실패'}</p>
                                <p className="text-xs opacity-90">{message}</p>
                                {status === 'success' && tableInfo && (
                                    <p className="text-xs mt-1 font-mono bg-white/50 p-1 rounded inline-block">{tableInfo}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            onClick={checkConnection}
                            className="flex-1 py-3 px-4 bg-brown-600 text-white rounded-xl font-bold hover:bg-brown-700 transition-colors"
                        >
                            다시 테스트
                        </button>
                        <Link
                            href="/"
                            className="flex-1 py-3 px-4 bg-cream-100 text-brown-700 rounded-xl font-bold hover:bg-cream-200 transition-colors text-center flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            홈으로
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
