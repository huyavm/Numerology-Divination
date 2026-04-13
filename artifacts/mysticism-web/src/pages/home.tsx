import { Navbar } from "@/components/layout/navbar";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4 z-10">
        <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg tracking-wider">
            Khám phá vận mệnh
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Huyền Bí là cánh cửa mở ra thế giới tâm linh phương Đông và phương Tây. 
            Giải mã những con số, thấu hiểu Tứ trụ và đón nhận những thông điệp từ vũ trụ.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            <Link href="/than-so-hoc" className="group">
              <Card className="h-full bg-card/50 hover:bg-card/80 border-border/50 transition-all duration-500 hover:border-primary/50 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary group-hover:text-primary-foreground transition-colors">Thần số học</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Khám phá ý nghĩa ẩn giấu đằng sau tên gọi và ngày sinh của bạn thông qua lăng kính của Pythagoras.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/bat-tu" className="group">
              <Card className="h-full bg-card/50 hover:bg-card/80 border-border/50 transition-all duration-500 hover:border-primary/50 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary group-hover:text-primary-foreground transition-colors">Bát tự Tứ Trụ</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Lập lá số Tử Bình, phân tích sự cân bằng Ngũ Hành để hiểu rõ về tính cách và tiềm năng của bản mệnh.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/xem-que" className="group">
              <Card className="h-full bg-card/50 hover:bg-card/80 border-border/50 transition-all duration-500 hover:border-primary/50 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary group-hover:text-primary-foreground transition-colors">Kinh Dịch</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Tìm kiếm sự chỉ dẫn từ trí tuệ cổ xưa qua 64 quẻ dịch. Đặt câu hỏi và nhận thông điệp từ vũ trụ.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
