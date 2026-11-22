package com.curable.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.curable.domain.CandidateRevisit;
import com.curable.service.dto.CandidateRevisitDTO;

@Mapper(componentModel = "spring", uses = {CandidateMapper.class, HospitalMapper.class})
public interface CandidateRevisitMapper extends EntityMapper<CandidateRevisitDTO, CandidateRevisit> {
	
	@Mapping(source = "candidate.id", target = "candidateId")
	
	CandidateRevisitDTO toDto(CandidateRevisit candidateRevisit);

	@Mapping(source = "candidateId", target = "candidate")

	CandidateRevisit toEntity(CandidateRevisitDTO candidateRevisitDTO);
	
	default CandidateRevisit fromId(Long id) {
		if (id == null) {
			return null;
		}
		CandidateRevisit candidateRevisit = new CandidateRevisit();
		candidateRevisit.setId(id);
		return candidateRevisit;
	}
}
