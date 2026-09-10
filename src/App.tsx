import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/Theme";
import { About } from "./pages/About";
import { ArticlePage } from "./pages/ArticlePage";
import { Articles } from "./pages/Articles";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { TagPage } from "./pages/TagPage";
import { Tags } from "./pages/Tags";
import { ToolPage } from "./pages/ToolPage";
import { Tools } from "./pages/Tools";
import { WriteupPage } from "./pages/WriteupPage";
import { Writeups } from "./pages/Writeups";

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/writeups" element={<Writeups />} />
            <Route path="/writeups/:slug" element={<WriteupPage />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/:slug" element={<ToolPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tags/:tag" element={<TagPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}
