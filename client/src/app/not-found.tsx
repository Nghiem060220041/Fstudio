"use client";

import { ErrorCard } from "@/components/card/error-card";
import { Shell } from "@/components/wrapper/shell-variant";

export default function NotFound({}) {
    return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Không tìm thấy trang này"
        description="Trang bạn đang tìm kiếm có thể đã hết hạn hoặc bạn có thể đã được cập nhật rồi."
        retryLink={`/`}
        retryLinkText="Quay lại"
      />
    </Shell>
    );
  }