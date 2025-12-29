<?php

namespace App\Exports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Illuminate\Support\Collection;

class RevenuesExport implements FromArray, WithHeadings, ShouldAutoSize
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        return [
            "id" => "ID",
            "created_at" => "Ngày đặt",
            "updated_at" => "Ngày cập nhật",
            "code" => "Số hóa đơn",
            "customer_id" => "Khách hàng",
            "total" => "Tổng tiền",
        ];
    }

    public function array(): array
    {
        $dataArray = $this->data->toArray();
        $headings = $this->headings();

        $mappedData = [];

        foreach ($dataArray as $dataItem) {
            $mappedItem = [];
            foreach ($headings as $dataKey => $heading) {
                if ($dataKey === 'customer_id') {
                    $customer = Customer::withTrashed()->find($dataItem[$dataKey]);
                    $mappedItem[$heading] = $customer ? "$customer->name - $customer->phone" : '';
                } else {
                    $mappedItem[$heading] = $dataItem[$dataKey] ?? '';
                }
            }
            $mappedData[] = $mappedItem;
        }

        return $mappedData;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getStyle('A1:D1')->getFont()->setBold(true);
                $event->sheet->getStyle('A1:D' . ($event->sheet->getHighestRow()))->getBorders()->getAllBorders()->setBorderStyle('thin');
                $highestRow = $event->sheet->getDelegate()->getHighestRow();

                $event->sheet->setCellValue('H' . ($highestRow + 1), '=SUM(H2:H' . $highestRow . ')');

                $event->sheet->getStyle('H' . ($highestRow + 1))->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
            },
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            // Các định dạng cột khác nếu cần
        ];
    }
}
