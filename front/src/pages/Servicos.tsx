import React, { useState, useEffect } from "react";
import TableComponent from "../components/Table/Table";
import Template from "./Template";
import api from "../services/api";
import { Button, Modal, Form, Input } from "antd";

interface Servico {
    id: string;
    nome: string;
    preco: string | number;
}

const Servicos: React.FC = () => {
    const [data, setData] = useState<Servico[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Nome do Serviço", dataIndex: "nome", key: "nome" },
        { title: "Preço", dataIndex: "preco", key: "preco" },
    ];

    const modalFields = [
        { name: "nome", label: "Nome do Serviço" },
        { name: "preco", label: "Preço", type: "number" },
    ];

    useEffect(() => {
        const fetchServicos = async () => {
            try {
                const response = await api.get("/servicos");
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar serviços:", error);
            }
        };

        fetchServicos();
    }, []);

    const handleSave = async (record: Servico) => {
        try {
            await api.put(`/servicos/${record.id}`, record);
            setData((prev) => prev.map((item) => (item.id === record.id ? record : item)));
        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
        }
    };

    const handleDelete = async (keys: React.Key[]) => {
        try {
            await Promise.all(keys.map((key) => api.delete(`/servicos/${key}`)));
            setData((prev) => prev.filter((item) => !keys.includes(item.id)));
        } catch (error) {
            console.error("Erro ao deletar serviços:", error);
        }
    };
    
    const handleAdd = async (values: any) => {
        try {
            const response = await api.post("/servicos", values);
            setData((prev) => [...prev, response.data]);
            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar serviço:", error);
        }
    };

    return (
        <Template title="Serviços" subtitle="Gerencie serviços">
            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                Adicionar Serviço
            </Button>
            <TableComponent
                columns={columns}
                data={data}
                onSave={handleSave}
                onDelete={handleDelete}
                modalFields={modalFields}
                rowKey="id"
            />

            <Modal
                title="Adicionar Serviço"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAdd}
                    initialValues={{}}
                >
                    {modalFields.map((field) => (
                        <Form.Item
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            rules={[{ required: true, message: `Por favor, insira ${field.label.toLowerCase()}` }]}
                        >
                            <Input type={field.type} />
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Salvar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Template>
    );
};

export default Servicos;
