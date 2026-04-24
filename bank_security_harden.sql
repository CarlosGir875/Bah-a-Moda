-- ==========================================================
-- 🏦 BLINDAJE DE SEGURIDAD NIVEL BANCARIO - BAHÍA MODA
-- ==========================================================

-- 1. ASEGURAR QUE RLS ESTÉ ACTIVADO EN TODAS LAS TABLAS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE finanzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA 'PROFILES' (Información Sensible)
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON profiles;
CREATE POLICY "Usuarios ven su propio perfil" ON profiles 
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins ven todos los perfiles" ON profiles;
CREATE POLICY "Admins ven todos los perfiles" ON profiles 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

DROP POLICY IF EXISTS "Usuarios actualizan su propio perfil" ON profiles;
CREATE POLICY "Usuarios actualizan su propio perfil" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- 3. POLÍTICAS PARA 'PEDIDOS' (Privacidad de Compra)
DROP POLICY IF EXISTS "Permitir todo pedidos" ON pedidos; -- Eliminar política insegura anterior

CREATE POLICY "Clientes ven sus propios pedidos" ON pedidos 
FOR SELECT USING (auth.uid() = cliente_id);

CREATE POLICY "Admins ven todos los pedidos" ON pedidos 
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- 4. POLÍTICAS PARA 'SOLICITUDES_PEDIDOS'
DROP POLICY IF EXISTS "Clientes ven sus propias solicitudes" ON solicitudes_pedidos;
CREATE POLICY "Clientes ven sus propias solicitudes" ON solicitudes_pedidos 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Cualquiera puede crear solicitudes" ON solicitudes_pedidos 
FOR INSERT WITH CHECK (true); -- Permitir pedidos como invitado

CREATE POLICY "Admins gestionan solicitudes" ON solicitudes_pedidos 
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- 5. POLÍTICAS PARA 'FINANZAS' (Solo Admin)
DROP POLICY IF EXISTS "Solo admins ven finanzas" ON finanzas;
CREATE POLICY "Solo admins ven finanzas" ON finanzas 
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- 6. POLÍTICAS PARA 'PRODUCTS' (Catálogo Seguro)
DROP POLICY IF EXISTS "Todos ven productos" ON products;
CREATE POLICY "Todos ven productos" ON products 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo admins editan productos" ON products;
CREATE POLICY "Solo admins editan productos" ON products 
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- 7. RESTRINGIR PERMISOS PÚBLICOS
REVOKE ALL ON TABLE finanzas FROM anon;
REVOKE ALL ON TABLE profiles FROM anon;
GRANT SELECT ON TABLE products TO anon, authenticated;
GRANT INSERT ON TABLE solicitudes_pedidos TO anon, authenticated;

-- ==========================================================
-- ✅ SISTEMA BLINDADO EXITOSAMENTE
-- ==========================================================
